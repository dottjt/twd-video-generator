import Youtube from 'youtube-api';
import fs from 'fs';
import fse from 'fs-extra';
import readJson from 'r-json';
import Lien from 'lien';
import Logger from 'bug-killer';
import opn from 'opn';
// import prettyBytes from 'pretty-bytes';
import path from 'path';

import {
  VIDEO_FOLDER
} from './constants';

import { episodeList } from './symbolic/data/episodes';
import { EpisodeData } from './symbolic/types/data';
import { getEpisodeData } from './getEpisodeData';

const CREDENTIALS = readJson(path.join(__dirname, '../', 'client_secrets.json'));
// const TWD_CHANNEL_ID = 'UCHnPAVZax7_QMufnSF8Pc9w';
const fakeYouTubeAPIPath = path.join(__dirname, '../', 'fake-youtube-api.txt');
let server = new Lien({ host: 'localhost', port: 4004 });

// Authenticate
// You can access the Youtube resources via OAuth2 only.
// https://developers.google.com/youtube/v3/guides/moving_to_oauth#service_accounts
let oauth = Youtube.authenticate({
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

const uploadYouTube = ({
  title,
  content,
  publishDate,
  tags,
  videoFile,
}: any) => new Promise((resolve, reject) => {
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
        privacyStatus: 'public',
        publishAt: publishDate
      }
    },
    media: {
      body: fs.createReadStream(path.join(VIDEO_FOLDER, videoFile))
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

const main = async () => {
  const videoFolderFilesAwait = await fse.readdir(VIDEO_FOLDER);
  const videoFolderFiles = videoFolderFilesAwait.filter(item => !item.includes('.DS_Store'));

  const file = fs.readFileSync(fakeYouTubeAPIPath);
  const fileString = file.toString();
  const uploadedEpisodeNumberList = fileString.split('\n').filter(Boolean).map(Number);

  for (const videoFile of videoFolderFiles) {
    const relevantFileName = videoFile.split('.')[0];
    const relevantEpisodeNumber = Number(relevantFileName.split('-')[1]);

    const videoExists = uploadedEpisodeNumberList.includes(relevantEpisodeNumber);

    if (!videoExists) {
      const NEWfile = fs.readFileSync(fakeYouTubeAPIPath);
      const NEWfileString = NEWfile.toString();
      const NEWuploadedEpisodeNumberList = NEWfileString.split('\n').filter(Boolean).map(Number);

      const episodeData = episodeList.find((episode: EpisodeData) => episode.episode_number === Number(relevantEpisodeNumber));

      const { title, content, publishDate, tags } = getEpisodeData(episodeData as EpisodeData);

      await uploadYouTube({
        title, content, publishDate, tags, videoFile
      })

      const newFakeYouTubeAPIString = NEWuploadedEpisodeNumberList.concat(relevantEpisodeNumber).sort().join('\n');
      fs.writeFileSync(fakeYouTubeAPIPath, newFakeYouTubeAPIString);
    }
  }
}

// Handle oauth2 callback
server.addPage('/oauth2callback', (lien: any) => {
  Logger.log('Trying to get the token using the following code: ' + lien.query.code);
  oauth.getToken(lien.query.code, async (err: any, tokens: any) => {
    if (err) {
      lien.lien(err, 400);
      return Logger.log(err);
    }
    Logger.log('Got the tokens.');
    lien.end('Thank you, bby ^^=-.');
    oauth.setCredentials(tokens);

    await main();
  });
});

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
