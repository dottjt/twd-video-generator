const fse = require('fs-extra');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const AUDIO_FOLDER = 'final-audio';
const VIDEO_FOLDER = 'final-video';
const VIDEO_FILE_FORMAT = 'mp4';

// __dirname is relative to the file it's being called from i.e. this file

const main = async () => {
  const audioFolder = path.join(__dirname, '..', '..', AUDIO_FOLDER);
  const videoFolder = path.join(__dirname, '..', '..', VIDEO_FOLDER)

  const audioFolderFiles = await fse.readdir(audioFolder);
  const videoFolderFiles = await fse.readdir(videoFolder);

  for (const audioFile of audioFolderFiles) {
    const relevantFileName = audioFile.split('.')[0];
    const videoExists = videoFolderFiles.includes(`${relevantFileName}.${VIDEO_FILE_FORMAT}`);

    if (!videoExists) {
      console.log(audioFile);
      const command = ffmpeg();
      

    }
  };

};

main();