import { Flag } from 'discord-akairo';
import { Message } from 'discord.js';

import { Command } from '../interfaces';

interface BirthdayArgs {
  subcommand: string;
  forwardedArgs: string;
}

export default class Birthday extends Command {
  constructor() {
    super('birthday', {
      aliases: ['birthday', 'bday'],
      channel: 'guild',
      category: 'birthday',
      description: 'Parent command for birthday related commands.',
    });
  }

  *args() {
    const subcommand = yield {
      type: ['set'],
    };

    const forwardedArgs = subcommand
      ? yield { type: 'string', match: 'restContent' }
      : yield { type: 'string', match: 'content' };

    return {
      subcommand: subcommand || 'set',
      forwardedArgs,
    };
  }

  exec = async (message: Message, args: BirthdayArgs) => {
    const { subcommand, forwardedArgs } = args;

    const command = this.client.commandHandler.modules.get(
      `birthday-${subcommand}`
    );
    if (command) {
      const parsedArgs = await command.parse(message, forwardedArgs);
      this.client.commandHandler.runCommand(message, command, parsedArgs);
    }
  };

  documentation = {
    examples: [],
    requiresMod: false,
    parentCommand: true,
  };
}
