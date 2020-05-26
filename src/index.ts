import fse from 'fs-extra';
import path from 'path';

import {
  AUDIO_FOLDER,
  VIDEO_FOLDER,
  VIDEO_FILE_FORMAT,
} from './constants';

import { runTemplate } from './generateTemplates';

// __dirname is relative to the file it's being called from i.e. this file

const main = async () => {
  const audioFolderFilesAwait = await fse.readdir(AUDIO_FOLDER);
  const videoFolderFilesAwait = await fse.readdir(VIDEO_FOLDER); // /Users/julius.reade/Google Drive/thewritersdailypodcast/final-video

  const audioFolderFiles = audioFolderFilesAwait.filter(item => !item.includes('.DS_Store'));
  const videoFolderFiles = videoFolderFilesAwait.filter(item => !item.includes('.DS_Store'));

  for (const audioFile of audioFolderFiles) {
    const relevantFileName = audioFile.split('.')[0];
    const videoExists = videoFolderFiles.includes(`${relevantFileName}.${VIDEO_FILE_FORMAT}`);

    // if (!videoExists) {
      runTemplate({
        relevantFileName,
        audioFile,
      });
    // }
  };

};

main();