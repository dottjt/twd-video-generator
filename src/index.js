const fse = require('fs-extra');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

// __dirname is relative to the file it's being called from i.e. this file.

const main = () => {
  const audioFolder  = path.join(__dirname, '..', 'final-mp3-audio');


  const command = ffmpeg();

  command
};

main();