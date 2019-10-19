import chalk, { Chalk } from 'chalk';
import { Message } from 'discord.js';

export class Log {
  static colour = (
    colour: Chalk | undefined,
    tag: string,
    message: string,
    ...messages: string[]
  ) => {
    const string = `[${tag}] ${message} ${messages.join(' ')}`;
    if (colour) {
      console.log(colour(string));
    } else {
      console.log(string);
    }
  };

  static default = (tag: string, message: string, ...messages: string[]) => {
    Log.colour(undefined, tag, message, ...messages);
  };

  static createColour = (colour: Chalk) => (
    tag: string,
    message: string,
    ...messages: string[]
  ) => Log.colour(colour, tag, message, ...messages);

  static green = Log.createColour(chalk.green);
  static yellow = Log.createColour(chalk.yellow);

  static failedCommand = (
    command: string,
    reason: string,
    sourceMsg: Message
  ) => {
    Log.yellow(
      command,
      `Failed: ${reason}.`,
      `Triggered by:\n${sourceMsg.content}`
    );
  };
}
