import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

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

const generateTemplate = ({
  relevantFileName,
  audioFile
}: Template): void => {
  const backgroundImage = getBackgroundImage();
  const episodeNumber = relevantFileName.split('-')[2];


// ffmpeg -y -i ./final-audio/ep-1-final.mp3 -loop 1 -i ./twd_video_generator/background-image/index.jpg \
// -filter_complex "[0:a]showwaves=s=1280x720:mode=cline,colorkey=0x000000:0.01:0.1,format=yuva420p[v]; \
// [1:v][v]vstack[outFirst]; \
// [outFirst]drawtext=fontfile=/path/to/font.ttf:text='Stack Overflow':fontcolor=white:fontsize=24:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=(h-text_h)/2[outv]" \
// -map "[outv]" -pix_fmt yuv420p -map 0:a -shortest -t 5 ./final-video/ep-1-final.mp4


  ffmpeg(`${AUDIO_FOLDER}/${audioFile}`) // original audio file
  .input(backgroundImage)
  .loop(1)
  .complexFilter([
    '[0:a]showfreqs=mode=line:ascale=log:fscale=log:s=1280x518[sf]',
    '[0:a]showwaves=s=1280x202:mode=p2p[sw]',
    '[sf][sw]vstack[fg]',
    '[1:v]scale=1280:-1,crop=iw:720[bg]',
    `[bg][fg]overlay=shortest=1:format=auto,format=yuv420p,drawtext=fontfile=${AVENIR_FONT}:fontcolor=white:x=10:y=10:text='Some text'[out]`
    // {
    //   filter: 'showwaves',
    //   options: {
    //     s: '128x96',
    //     mode: 'cline'
    //   },
    //   inputs: '0:a',
    //   outputs: 'out'
    // },
    // {
    //   filter: 'overlay',
    //   outputs: 'out'
    // }
    // {
    //   filter: 'vstack',
    //   inputs: ['sw'],
    //   outputs: ['fg']
    // },
    // // '[0:a]showwaves=s=1280x202:mode=p2p[sw]',
    // // ''
    // {
    //   filter: 'drawtext',
    //   options: {
    //     fontfile: AVENIR_FONT,
    //     text: 'yeahhh',
    //     fontsize: 24,
    //     fontcolor: 'white',
    //     x: '(main_w/2-text_w/2)',
    //     y: 50,
    //     shadowcolor: 'black',
    //     shadowx: 2,
    //     shadowy: 2
    //   },
    //   inputs: ['fg'],
    //   outputs: 'out'
    // }
    // drawTextObject({ font: AVENIR_FONT, text: '#YOLO' }),
    // '[showwavesOutput]vstack[drawTextOutput][output]',
          // {
    //   filter: 'size',
    //   options: '1280x720',
    // },
    // {
    //   filter: 'aspect',
    //   options: '16:9'
    // },
  ], 'out')

  // .videoFilters([
  //   drawTextObject({ font: AVENIR_FONT, text: '#YOLO' }),
  // ])
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
