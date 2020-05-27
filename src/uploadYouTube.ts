import Youtube from 'youtube-api';
import fs from 'fs';
import readJson from 'r-json';
import Lien from 'lien';
import Logger from 'bug-killer';
import opn from 'opn';
import prettyBytes from 'pretty-bytes';

const CREDENTIALS = readJson(`../${__dirname}/client_secrets.json`);

let server = new Lien({ host: 'localhost', port: 4004 });

// Authenticate
// You can access the Youtube resources via OAuth2 only.
// https://developers.google.com/youtube/v3/guides/moving_to_oauth#service_accounts
let oauth = Youtube.authenticate({
  type: 'oauth'
  , client_id: CREDENTIALS.web.client_id
  , client_secret: CREDENTIALS.web.client_secret
  , redirect_url: CREDENTIALS.web.redirect_uris[0]
});

opn(oauth.generateAuthUrl({
  access_type: 'offline', scope: ['https://www.googleapis.com/auth/youtube.upload']
}));

// Handle oauth2 callback
server.addPage('/oauth2callback', (lien: any) => {
  Logger.log('Trying to get the token using the following code: ' + lien.query.code);
  oauth.getToken(lien.query.code, ((err: any, tokens: any) => {
    if (err) {
      lien.lien(err, 400);
      return Logger.log(err);
    }

    Logger.log('Got the tokens.');

    oauth.setCredentials(tokens);

    lien.end('The video is being uploaded. Check out the logs in the terminal.');

    uploadYouTube();
  }));
});

const uploadYouTube = () => {
  const req = Youtube.videos.list({}, (err: any, data: any) => {
    console.log(data);

    console.log('Done. Video Uploaded.');
    process.exit();
  });


  // const req = Youtube.videos.insert({
  //   resource: {
  //     // Video title and description
  //     snippet: {
  //       title: 'Testing YoutTube API NodeJS module'
  //       , description: 'Test video upload via YouTube API'
  //     }
  //     // I don't want to spam my subscribers
  //     , status: {
  //       privacyStatus: 'public'
  //     }
  //   }
  //   // This is for the callback function
  //   , part: 'snippet,status'

  //   // Create the readable stream to upload the video
  //   , media: {
  //     body: fs.createReadStream('video.mp4')
  //   }
  // }, (err: any, data: any) => {
  //   console.log('Done. Video Uploaded.');
  //   process.exit();
  // });

  // setInterval(function () {
  //   Logger.log(`${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded.`);
  // }, 250);
}





https://developers.google.com/youtube/v3/docs/videos