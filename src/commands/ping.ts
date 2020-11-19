import { Message } from 'discord.js';

import { Command } from './interfaces';

export default class Ping extends Command {
  constructor() {
    super('ping', { aliases: ['ping'] });
  }

  exec = (message: Message) => {
    return message.channel.send('Pong!');
  };
}
