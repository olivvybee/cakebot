import { Channel } from 'discord.js';
import { Message } from 'discord.js';

import { Command } from './interfaces';

interface EchoArgs {
  channel: Channel | null;
  text: string | null;
}

export default class Echo extends Command {
  constructor() {
    super('echo', {
      aliases: ['echo'],
    });
  }

  *args() {
    const channel = yield { type: 'channelMention' };

    // Hacky way to include the first word if it's not a channel name
    // (If normal args are used then the first word will always be
    // consumed even if it's not a channel name)
    const text = channel
      ? yield { type: 'string', match: 'restContent' }
      : yield { type: 'string', match: 'content' };

    return { channel, text };
  }

  exec = (message: Message, args: EchoArgs) => {
    const { channel: argsChannel, text } = args;
    const channel = argsChannel || message.channel;

    if (!text || text.length === 0) {
      this.error('Cannot send an empty message.');
      return;
    }

    if (!channel.isText()) {
      this.error('Specified channel is not a text channel.');
      return;
    }

    return channel.send(text);
  };
}
