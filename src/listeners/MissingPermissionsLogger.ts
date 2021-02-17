import { Command, Constants } from 'discord-akairo';
import { Message } from 'discord.js';
import { Listener } from './interfaces';

export default class MissingPermissionsLogger extends Listener {
  constructor() {
    super('missingPermissionsLogger', {
      emitter: 'commandHandler',
      event: Constants.CommandHandlerEvents.MISSING_PERMISSIONS,
    });
  }

  exec = (
    message: Message,
    command: Command,
    type: 'user' | 'client',
    reason: string
  ) => {
    const userId = message.author.id;
    this.log(
      `${command.id} could not be run by ${userId} due to missng permissions: ${reason}`
    );
  };
}
