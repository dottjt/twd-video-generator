import path from 'path';
import { generateVideo } from './generateVideo';
import { setupYouTubeUpload } from './uploadYouTube';

// __dirname is relative to the file it's being called from i.e. this file
const main = async () => {
  // const TWD_CHANNEL_ID = 'UCHnPAVZax7_QMufnSF8Pc9w';
  const credentialsFile = path.join(__dirname, '..', 'client_secrets.json');
  const fakeYouTubeAPIFile = path.join(__dirname, '..', 'fake-youtube-api.txt');

  const rootFolder = path.join(__dirname, '..');
  const audioFolder = path.join(__dirname, '..', '..', 'final-audio');
  const videoFolder = path.join(__dirname, '..', '..', 'final-video');
  const videoFont = '/System/Library/Fonts/Avenir.ttc';

  const backgroundImageFolder = path.join(__dirname, '..', 'background-image');
  const podcastLogoFile = path.join(__dirname, '..', 'assets', 'logo_400.png');

  await generateVideo({
    rootFolder,
    audioFolder,
    videoFolder,
    backgroundImageFolder,
    videoFont,
    podcastLogoFile,
  });

  await setupYouTubeUpload({
    videoFolder,
    credentialsFile,
    fakeYouTubeAPIFile,
  });

  credentialsFile
fakeYouTubeAPIFile
};

main();

