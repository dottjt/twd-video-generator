type DrawTextObject = {
  font: string;
  text: string;
};

export const drawTextObject = ({
  font,
  text,
}: DrawTextObject) => ({
  filter: 'drawtext',
  options: {
    fontfile: font,
    text,
    fontsize: 24,
    fontcolor: 'white',
    x: '(main_w/2-text_w/2)',
    y: 50,
    shadowcolor: 'black',
    shadowx: 2,
    shadowy: 2
  }
});

// drawtext="fontfile=/path/to/font.ttf: \
// text='Stack Overflow': fontcolor=white: fontsize=24: box=1: boxcolor=black@0.5: \
// boxborderw=5: x=(w-text_w)/2: y=(h-text_h)/2"
