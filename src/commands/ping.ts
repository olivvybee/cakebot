import { Message } from 'discord.js';

import { Command } from './interfaces';

export default class Ping extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping'],
      description: 'Checks that I can send and receive messages.',
    });
  }

  exec = (message: Message) => {
    return message.channel.send('Pong!');
  };

  examples = [
    {
      args: '',
      description:
        'Replies with "Pong!" if your message is received successfully.',
    },
  ];
}
