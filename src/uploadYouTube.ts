import Youtube from 'youtube-api';
import fs from 'fs';
import fse from 'fs-extra';
import readJson from 'r-json';
import Lien from 'lien';
import Logger from 'bug-killer';
import opn from 'opn';
// import prettyBytes from 'pretty-bytes';
import path from 'path';

import { data, EpisodeData } from '@dottjt/datareade';
import { getEpisodeData } from './util/getEpisodeData';

type UploadProps = {
  title: string;
  content: string;
  publishDate: string;
  tags: string;
  videoFile: string;
};

// NOTE: status.publishAt property can only be set if the video's privacy status is private and the video has never been published. This is because it is MADE public once it is published.
// https://stackoverflow.com/questions/47545477/update-publishat-error-invalidvideometadata-youtube-v3-api-php
const upload = ({
  title,
  content,
  publishDate,
  tags,
  videoFile,
}: UploadProps) => new Promise((resolve, reject) => {
  Youtube.videos.insert({
    part: 'snippet,status',
    resource: {
      snippet: {
        title: `The Writer's Daily ${title}`,
        description: content,
        tags: [
          'The Writer\'s Daily',
          'Podcast',
          'Writing podcast',
          title,
          'topic',
          'news',
          'comedy'
        ].concat(tags),
        categoryId: 24, // https://gist.github.com/dgp/1b24bf2961521bd75d6c
        defaultLanguage: 'en'
      },
      status: {
        privacyStatus: 'private',
        publishAt: publishDate
      }
    },
    media: {
      body: fs.createReadStream(videoFile)
    }
  }, (err: any, data: any) => {
    if (err) {
      console.log('error.', err);
      reject(err);
    }
    console.log('Video Uploaded.');
    resolve(data);
  });
})

type UploadVideosProps = {
  videoFolder: string;
  fakeYouTubeAPIFile: string;
};

const uploadVideos = async ({
  videoFolder,
  fakeYouTubeAPIFile,
}: UploadVideosProps) => {
  const videoFolderFilesAwait = await fse.readdir(videoFolder);
  const videoFolderFiles = videoFolderFilesAwait.filter(item => !item.includes('.DS_Store'));

  const file = fs.readFileSync(fakeYouTubeAPIFile);
  const fileString = file.toString();
  const uploadedEpisodeNumberList = fileString.split('\n').filter(Boolean).map(Number);

  for (const videoFile of videoFolderFiles) {
    const relevantFileName = videoFile.split('.')[0];
    const relevantEpisodeNumber = Number(relevantFileName.split('-')[1]);

    const videoExists = uploadedEpisodeNumberList.includes(relevantEpisodeNumber);

    if (!videoExists) {
      const NEWfile = fs.readFileSync(fakeYouTubeAPIFile);
      const NEWfileString = NEWfile.toString();
      const NEWuploadedEpisodeNumberList = NEWfileString.split('\n').filter(Boolean).map(Number);

      const episodeData = data.episodesTWD.find((episode: EpisodeData) => episode.episode_number === Number(relevantEpisodeNumber));
      const { title, content, publishDate, tags } = getEpisodeData(episodeData as EpisodeData);

      console.log(`Upload ${title} - publishDate: ${publishDate}`);

      await upload({
        title,
        content,
        publishDate,
        tags,
        videoFile
      });

      const newFakeYouTubeAPIString = NEWuploadedEpisodeNumberList.concat(relevantEpisodeNumber).sort().join('\n');
      fs.writeFileSync(fakeYouTubeAPIFile, newFakeYouTubeAPIString);

      console.log(`${title} video upload complete.`);
    }
  }
  console.log('All videos uploaded!');
}

type SetupYoutubeUploadProps = {
  videoFolder: string;
  credentialsFile: string;
  fakeYouTubeAPIFile: string;
};

export const setupYouTubeUpload = ({
  videoFolder,
  credentialsFile,
  fakeYouTubeAPIFile,
}: SetupYoutubeUploadProps) => {
  const CREDENTIALS = readJson(credentialsFile);
  const server = new Lien({ host: 'localhost', port: 4004 });

  // You can access the Youtube resources via OAuth2 only.
  // https://developers.google.com/youtube/v3/guides/moving_to_oauth#service_accounts
  const oauth = Youtube.authenticate({
    type: 'oauth',
    client_id: CREDENTIALS.web.client_id,
    client_secret: CREDENTIALS.web.client_secret,
    redirect_url: CREDENTIALS.web.redirect_uris[2] // because this is where localhost:4004 is located.
  });

  opn(oauth.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube.force-ssl',
        'https://www.googleapis.com/auth/youtube.readonly'
      ]
    }));

  server.addPage('/oauth2callback', (lien: any) => {
    Logger.log('Trying to retrieve the token using the following code: ' + lien.query.code);
    oauth.getToken(lien.query.code, async (err: any, tokens: any) => {
      if (err) {
        lien.lien(err, 400);
        return Logger.log(err);
      }
      Logger.log('Token retrieved.');
      lien.end('Thank you, bby ^^=-.');
      oauth.setCredentials(tokens);

      await uploadVideos({
        videoFolder,
        fakeYouTubeAPIFile,
      });
    });
  });
}


// https://developers.google.com/youtube/v3/guides/implementation/pagination
// const listYouTubeVideos = () => new Promise((resolve, reject) => {
//   Youtube.videos.list({
//     id: TWD_CHANNEL_ID,
//     part: 'contentDetails',
//     order: 'date',
//     mine: true // don't know if this does anything.
//   }, (err: any, data: any) => {
//     if (err) {
//       console.log('error', err);
//       reject(err);
//     }
//     console.log('Video List Retrieved.');
//     resolve(data);
//   });
// });
