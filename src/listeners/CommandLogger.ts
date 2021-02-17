import { Command, Constants } from 'discord-akairo';
import { Message } from 'discord.js';
import { Listener } from './interfaces';

export default class CommandLogger extends Listener {
  constructor() {
    super('commandLogger', {
      emitter: 'commandHandler',
      event: Constants.CommandHandlerEvents.COMMAND_STARTED,
    });
  }

  exec = (message: Message, command: Command, args: any) => {
    const userId = message.author.id;
    const argList = !!args
      ? Object.entries(args)
          .map(([name, value]) => `${name}=\`${value}\``)
          .join(', ')
      : '';
    this.log(`${command.id} called by ${userId} with args: ${argList}`);
  };
}
