import fse from 'fs-extra';
import path from 'path';
import atob from 'atob';
import * as svgToImg from "svg-to-img";
import * as hero from 'hero-patterns';

import { heroPatternsPropertyList } from './heroPatternsConfig';
import colors from './colors';

const randomItemNumber = (stringArray: string[]): string => {
  return  stringArray[Math.floor(Math.random() * stringArray.length)];
}

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)
const roundTo = (increment: number, number: number) => Math.round(number / increment) * increment
const genAlpha = () => roundTo(5, random(23, 102)) / 100;

const generateHeroPatternSVG = (name: string) => {
  // generate random color combination and opacity value
  let [c1, c2] = colors[random(1, colors.length) - 1];
  if (random(1, 2) === 1) [c1, c2] = [c2, c1];
  const alpha = genAlpha();

  return {
    fn: name,
    params: alpha === 1 ? [c2] : [c2, alpha]
  }
}

export const generateRandomSVGBackgroundImage = async () => {
  const { fn, params } = generateHeroPatternSVG(randomItemNumber(heroPatternsPropertyList));

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


}

export const generateBackgroundImage = (): string => {
  const backgroundImage = path.join(__dirname, '..', 'background-image', 'index.jpg');
  return backgroundImage;
};

