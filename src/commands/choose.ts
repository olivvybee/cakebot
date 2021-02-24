import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import { pickRandom } from '../utils/random';
import { Command } from './interfaces';

interface ChooseArgs {
  options: string | null;
}

export default class Choose extends Command {
  constructor() {
    super('choose', {
      aliases: ['choose', 'pick'],
      args: [{ id: 'options', match: 'content' }],
      channel: 'guild',
      description: 'Randomly chooses an item from a list.',
    });
  }

  exec = (message: Message, args: ChooseArgs) => {
    if (!args.options) {
      return message.channel.send(
        'You need to give me some options to choose from.'
      );
    }

    const options = args.options.split('/').map((item) => item.trim());

    if (options.length <= 1) {
      return message.channel.send(
        'You need to give me at least two options to choose from, separated by slashes. (e.g. `red/green/blue`)'
      );
    }

    const chosenOption = pickRandom(options);

    const embed = new MessageEmbed()
      .setTitle('I choose...')
      .setDescription(chosenOption);

    return message.channel.send(embed);
  };

  documentation = {
    examples: [
      {
        args: '<option1>/<option2>/<option3>',
        description: 'Chooses a random item from the specified options.',
      },
    ],
    requiresMod: false,
  };
}
