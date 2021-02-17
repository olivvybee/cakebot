import chalk from 'chalk';
import _pick from 'lodash/pick';

const functions = {
  system: chalk.green,
  permissions: chalk.cyan,
  command: chalk.blue,
  listener: chalk.magenta,
  error: chalk.red,
  utility: chalk.yellow,
  plain: chalk.white,
};

export const createLogFunction = (
  tag: string,
  type: keyof typeof functions
) => (...data: any[]) => console.log(functions[type](`[${tag}]`, ...data));
