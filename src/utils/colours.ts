import chalk from 'chalk';

export const chalkify = (hex: string) => {
  const colour = hex.startsWith('#') ? hex : `#${hex}`;
  return chalk.hex(colour)(colour);
};

export const hexToRgb = (hex: string) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : undefined;
};
