import Color from 'color';
import { CONTRAST_THRESHOLD } from '../constants';

export const getContrastString = (a: string, b: string) => {
  const colourA = Color(a);
  const colourB = Color(b);

  const contrast = colourA.contrast(colourB);
  const emoji = contrast >= CONTRAST_THRESHOLD ? '✅' : '⚠️';

  return `${emoji}  ${contrast.toFixed(2)}`;
};
