import * as hero from 'hero-patterns';
import ffmpeg from 'fluent-ffmpeg';
import fse from 'fs-extra';
import path from 'path';
import atob from 'atob';
import * as svgToImg from "svg-to-img";

import { heroPatternsPropertyList } from './heroPatternsConfig';
import colors from './colors';
import { episodeList } from '/Users/julius.reade/Code/PER/thewritersdaily/util/data/episodes';

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

// const getSVGBackground = (svgString) => {
// };

const randomItemNumber = (stringArray: string[]): string => {
  return  stringArray[Math.floor(Math.random() * stringArray.length)];
}

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)
const roundTo = (increment: number, number: number) => Math.round(number / increment) * increment
const genAlpha = () => roundTo(5, random(23, 102)) / 100;

const generateSVGBackground = (name: string) => {
  // generate random color combination and opacity value
  let [c1, c2] = colors[random(1, colors.length) - 1];
  if (random(1, 2) === 1) [c1, c2] = [c2, c1];
  const alpha = genAlpha();

  return {
    fn: name,
    params: alpha === 1 ? [c2] : [c2, alpha]
  }
}

const generateTemplate = async ({
  relevantFileName,
  audioFile
}: Template): Promise<void> => {
  const backgroundImage = getBackgroundImage();
  const episodeNumber = relevantFileName.split('-')[1];

  const episodeData = episodeList.find((episode: any) => episode.episode_number === Number(episodeNumber));
  const episodeTitle = episodeData.title;

  const { fn, params } = generateSVGBackground(randomItemNumber(heroPatternsPropertyList));

  const heroFn = hero[fn];
  const svgURI = heroFn.apply(null, params);

  const svgString = svgURI.replace(/data:image\/svg\+xml;base64,/, '');
  // console.log(svgString);
  console.log(svgString)

  const image = await svgToImg.from(svgString).toPng({
    path: "../example.png"
  });


  // svg2img(
  //   svgString,
  //   { width: 1280, height: 720, preserveAspectRatio:true},
  //   function(error: any, buffer: any) {
  //   //returns a Buffer
  //   fse.writeFileSync('foo1.png', buffer);
  // });


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



// '[0:a]showfreqs=mode=line:ascale=log:fscale=log:s=1280x518[sf]',
// '[0:a]showwaves=s=1280x202:mode=p2p[sw]',
// '[sf][sw]vstack[fg]',
// '[1:v]scale=1280:-1,crop=iw:720[bg]',
// `[bg][fg]overlay=shortest=1:format=auto,format=yuv420p,drawtext=fontfile=${AVENIR_FONT}:fontcolor=white:x=10:y=10:text='Some text'[out]`
