const fse = require('fs-extra');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const AUDIO_FOLDER = 'final-audio';
const VIDEO_FOLDER = 'final-video';
const VIDEO_FILE_FORMAT = 'mp4';

// __dirname is relative to the file it's being called from i.e. this file

const getBackgroundImage = () => {
  const backgroundImage = path.join(__dirname, '..', 'background-image', 'index.jpg');
  return backgroundImage;
};

const main = async () => {
  const audioFolder = path.join(__dirname, '..', '..', AUDIO_FOLDER);
  const videoFolder = path.join(__dirname, '..', '..', VIDEO_FOLDER)

  const audioFolderFiles = await fse.readdir(audioFolder);
  const videoFolderFiles = await fse.readdir(videoFolder); // /Users/julius.reade/Google Drive/thewritersdailypodcast/final-video

  for (const audioFile of audioFolderFiles) {
    const relevantFileName = audioFile.split('.')[0];
    const videoExists = videoFolderFiles.includes(`${relevantFileName}.${VIDEO_FILE_FORMAT}`);

    if (!videoExists) {
      const backgroundImage = getBackgroundImage();

      ffmpeg(`${audioFolder}/${audioFile}`) // original audio file
        .inputFPS(25)
        .complexFilter([
          ''
        ])
        .input(backgroundImage)

        .videoFilters([
          {
            filter: 'drawtext',
            options: {
              fontfile:'/vagrant/fonts/LucidaGrande.ttc',
              text: 'THIS IS TEXT',
              fontsize: 24,
              fontcolor: 'white',
              x: '(main_w/2-text_w/2)',
              y: 50,
              shadowcolor: 'black',
              shadowx: 2,
              shadowy: 2
            }
          }
        ])
        drawtext="fontfile=/path/to/font.ttf: \
        text='Stack Overflow': fontcolor=white: fontsize=24: box=1: boxcolor=black@0.5: \
        boxborderw=5: x=(w-text_w)/2: y=(h-text_h)/2"

        // .inputOptions([
        //   '-option1',
        //   '-option2 param2',
        //   '-option3',
        //   '-option4 param4'
        // ])
        // .input()
        // .inputOptions([
        //   '-option1',
        //   '-option2 param2',
        //   '-option3',
        //   '-option4 param4'
        // ])
        // .size()
        // .videoFilters('fade=in:0:30')
        .size('1280×720')
        .output(`${videoFolder}/${relevantFileName}.mp4`)
        .on('start', function(commandLine) {
          console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('end', function(commandLine) {
          console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .run();
    }
  };

};

main();