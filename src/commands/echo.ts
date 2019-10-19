import { Command, RunFunction } from '../interfaces/Command';
import { Log } from '../utils/logging';
import { parseChannel } from '../utils/parsers';
import { TextChannel } from 'discord.js';

interface EchoParams {
  channel?: string;
  message: string;
}

export default class Echo implements Command<EchoParams> {
  name = 'echo';
  params = [
    { name: 'channel', optional: true },
    { name: 'message', multipleWords: true }
  ];
  description = 'Repeats text in a specific channel.';
  examples = [
    {
      usage: 'echo I love you',
      description: 'Sends "I love you" in the current channel.'
    },
    {
      usage: 'echo #general I love you',
      description:
        'Sends "I love you" in the #general channel, even if the command is given in another channel.'
    }
  ];

  run: RunFunction<EchoParams> = async ({
    params,
    message: sourceMsg,
    channel: sourceChannel,
    guild
  }) => {
    const { channel, message } = params;

    if (!message) {
      Log.failedCommand(this.name, 'No message', sourceMsg);
      return;
    }

    if (channel) {
      const destinationChannel = parseChannel(channel, guild);
      if (!destinationChannel) {
        sourceChannel.send(`⚠️ I couldn't find a channel named ${channel}.`);
        Log.failedCommand(this.name, 'Invalid channel', sourceMsg);
        return;
      }
      (destinationChannel as TextChannel).send(message);
    } else {
      sourceChannel.send(message);
    }

    sourceMsg.react('✅');
  };
}
