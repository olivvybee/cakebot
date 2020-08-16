import chalk from 'chalk';
import _pick from 'lodash/pick';

const colours = _pick(chalk, [
  'white',
  'red',
  'yellow',
  'green',
  'cyan',
  'blue',
  'magenta',
  'black',
  'grey',
]);

export const createLogFunctions = (
  tag: string
): { [colour: string]: chalk.Chalk } =>
  Object.entries(colours).reduce(
    (logFunctions, [colour, func]) => ({
      ...logFunctions,
      [colour]: (...data: any[]) => console.log(func(`[${tag}]`, ...data)),
    }),
    {}
  );
