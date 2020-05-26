import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
// import svg2img from 'svg2img';

import { episodeList } from '/Users/julius.reade/Code/PER/thewritersdaily/util/data/episodes.ts';

import {
  AUDIO_FOLDER,
  VIDEO_FOLDER,

  VIDEO_FILE_FORMAT,

  // FONTS
  AVENIR_FONT,
} from './constants';

import {
  drawTextObject
} from './drawText';

type Template = {
  relevantFileName: string,
  audioFile: string
}

const getBackgroundImage = (): string => {
  const backgroundImage = path.join(__dirname, '..', 'background-image', 'index.jpg');
  return backgroundImage;
};

const getSVGBackground = () => {
// svg2img(
  // svgString,
  // { width: 1280, height: 720, preserveAspectRatio:true},
  // function(error, buffer) {
//   //returns a Buffer
//   fs.writeFileSync('foo1.png', buffer);
// });
};

const generateTemplate = ({
  relevantFileName,
  audioFile
}: Template): void => {
  const backgroundImage = getBackgroundImage();
  const episodeNumber = relevantFileName.split('-')[1];

  const episodeData = episodeList.find((episode: any) => episode.episode_number === Number(episodeNumber));
  const episodeTitle = episodeData.title;
  // ffmpeg -y -i ./final-audio/ep-1-final.mp3 -loop 1 -i ./twd_video_generator/background-image/index.jpg -i ./twd_video_generator/assets/logo_400.png  \
  // -filter_complex "[0:a]showwaves=s=1280x720:mode=cline,colorkey=0x000000:0.01:0.1,format=yuva420p[v]; \
  // [1:v][v]overlay[outFirst]; \
  // [outFirst][2:v]overlay=(W-w)/2:(H-h)/2[outSecond]; \
  // [outSecond]drawtext=fontfile=/path/to/font.ttf:text='#1 - The Beginning':fontcolor=white:fontsize=24:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=h-80[outv]" \
  // -map "[outv]" -pix_fmt yuv420p -map 0:a -shortest -t 5 ./final-video/ep-1-final.mp4

  ffmpeg(`${AUDIO_FOLDER}/${audioFile}`) // original audio file
    .input(backgroundImage)
    .input('./assets/logo_400.png')
    // .loop(1)
    .complexFilter([
      '[0:a]showwaves=s=1280x720:mode=cline,colorkey=0x000000:0.01:0.1,format=yuva420p[v]',
      '[1:v][v]overlay[outFirst]',
      '[outFirst][2:v]overlay=(W-w)/2:(H-h)/2[outSecond]',
      `[outSecond]drawtext=fontfile=${AVENIR_FONT}:text='#1 - The Beginning':fontcolor=white:fontsize=24:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=h-80[outv]`,
    ], 'outv')
    .addInputOption('-framerate 25')
    .outputOptions(['-pix_fmt yuv420p', '-map 0:a', '-shortest', '-t 5'])
    .output(`${VIDEO_FOLDER}/${relevantFileName}.${VIDEO_FILE_FORMAT}`)
    .on('start', function(commandLine) {
      console.log(commandLine);
    })
    .on('end', function(commandLine) {
      console.log('finished');
    })
    .on('error', function(err) {
      console.log('an error happened: ' + err.message);
    })
    .run();
}

export const runTemplate = (template: Template): void => {
  generateTemplate(template);
}



// '[0:a]showfreqs=mode=line:ascale=log:fscale=log:s=1280x518[sf]',
// '[0:a]showwaves=s=1280x202:mode=p2p[sw]',
// '[sf][sw]vstack[fg]',
// '[1:v]scale=1280:-1,crop=iw:720[bg]',
// `[bg][fg]overlay=shortest=1:format=auto,format=yuv420p,drawtext=fontfile=${AVENIR_FONT}:fontcolor=white:x=10:y=10:text='Some text'[out]`
