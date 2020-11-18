import { Message } from 'discord.js';

import { Command } from './interfaces';

export default class Ping extends Command {
  constructor() {
    super('ping', { aliases: ['ping'] });
  }

  exec = (message: Message) => {
    const timeNow = new Date();
    const sentTime = message.createdAt;
    const timeDifference = sentTime.getTime() - timeNow.getTime();
    const latency = (timeDifference / 1000).toFixed(2);

    return message.channel.send(`Pong!\nLatency: ${latency}ms`);
  };
}
