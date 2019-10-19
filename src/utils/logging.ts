import chalk, { Chalk } from 'chalk';
import { Message } from 'discord.js';
import { Command } from '../interfaces';
import { Listener } from '../interfaces/Listener';

export class Log {
  static colour = (
    colour: Chalk | undefined,
    tag: string | undefined,
    message: string,
    ...messages: string[]
  ) => {
    const displayTag = tag ? `[${tag}]` : '';
    const string = `${displayTag} ${message} ${messages.join(' ')}`;
    if (colour) {
      console.log(colour(string));
    } else {
      console.log(string);
    }
  };

  static default = (tag: string, message: string, ...messages: string[]) => {
    Log.colour(undefined, tag, message, ...messages);
  };

  static continued = (message: string, ...messages: string[]) => {
    const indentedMessages = [message, ...messages]
      .join(' ')
      .replace(/\n/g, '\n ==>');
    Log.colour(undefined, undefined, `==> ${indentedMessages}`);
  };

  static createColour = (colour: Chalk) => (
    tag: string,
    message: string,
    ...messages: string[]
  ) => Log.colour(colour, tag, message, ...messages);

  static green = Log.createColour(chalk.green);
  static yellow = Log.createColour(chalk.yellow);

  static failedCommand = (
    command: Command<any>,
    reason: string,
    sourceMsg: Message
  ) => {
    Log.yellow(
      command.displayName,
      `Failed: ${reason}.`,
      `Triggered by:\n${sourceMsg.content}`
    );
  };

  static failedListener = (
    listener: Listener<any>,
    reason: string,
    params: any[]
  ) => {
    Log.yellow(
      listener.displayName,
      `Failed: ${reason}.`,
      `Parameters:\n${params.join(' | ')}`
    );
  };
}
