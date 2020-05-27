import ffmpeg from 'fluent-ffmpeg';

import { episodeList } from './symbolic/data/episodes';

import {
  AUDIO_FOLDER,
  VIDEO_FOLDER,

  VIDEO_FILE_FORMAT,

  // FONTS
  AVENIR_FONT,
} from './constants';

type Template = {
  relevantFileName: string,
  audioFile: string
}

import {
  generateBackgroundImage,
  // generateRandomSVGBackgroundImage
} from './generateBackgroundImage';

import { EpisodeData } from './symbolic/types/data';

const getEpisodeData = (episodeNumber: string): any => {
  const episodeData = episodeList.find((episode: any) => episode.episode_number === Number(episodeNumber));
  const episodeTitle = episodeData?.title;
  return {
    episodeTitle,
  }
}

const generateTemplate = async ({
  relevantFileName,
  audioFile
}: Template): Promise<void> => {
  const backgroundImage = generateBackgroundImage();
  const episodeNumber = relevantFileName.split('-')[1];
  const { episodeTitle } = getEpisodeData(episodeNumber);

  // generateRandomSVGBackgroundImage();

  ffmpeg(`${AUDIO_FOLDER}/${audioFile}`) // original audio file
    .input(backgroundImage)
    .input('./assets/logo_400.png')
    .complexFilter([
      '[0:a]showwaves=s=1280x720:mode=cline,colorkey=0x000000:0.01:0.1[v]',
      '[1:v][v]overlay[outFirst]',
      '[outFirst][2:v]overlay=(W-w)/2:(H-h)/2[outSecond]',
      `[outSecond]drawtext=fontfile=${AVENIR_FONT}:text='${episodeTitle}':fontcolor=white:fontsize=24:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=h-80,fade=in:0:25[outv]`,
    ], 'outv')
    .addInputOption('-framerate 25')
    .outputOptions(['-pix_fmt yuv420p', '-map 0:a', '-shortest', '-t 5'])
    .output(`${VIDEO_FOLDER}/${relevantFileName}.${VIDEO_FILE_FORMAT}`)
    .on('start', function(commandLine) {
      console.log(commandLine);
    })
    .on('end', function(commandLine) {
      console.log(`finished creating ${relevantFileName}.${VIDEO_FILE_FORMAT}`);
    })
    .on('error', function(err) {
      console.log('an error happened: ' + err.message);
    })
    .run();
}

export const runTemplate = (template: Template): void => {
  generateTemplate(template);
}