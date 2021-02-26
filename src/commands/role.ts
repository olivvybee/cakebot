import Color from 'color';
import { Message, MessageEmbed, Role as DiscordRole } from 'discord.js';
import { CONTRAST_THRESHOLD, DISCORD_BG_COLOUR } from '../constants';
import { getContrastString } from '../utils/colour';

import { Command } from './interfaces';

interface RoleArgs {
  role: DiscordRole | null | undefined;
}

export default class Role extends Command {
  constructor() {
    super('role', {
      aliases: ['role'],
      args: [{ id: 'role', type: 'role' }],
      channel: 'guild',
      description: 'Shows information about a role.',
    });
  }

  exec = (message: Message, args: RoleArgs) => {
    const { role } = args;

    if (role === null) {
      return message.channel.send('You need to give me a role to look up.');
    }
    if (role === undefined) {
      return message.channel.send("I can't find that role.");
    }

    const { name, hexColor, members } = role;

    const colour = Color(hexColor);
    const rgb = colour.rgb().array().join(', ');

    const contrast = getContrastString(hexColor, DISCORD_BG_COLOUR);

    const embed = new MessageEmbed()
      .setTitle(name)
      .setColor(hexColor)
      .addField('Hex', hexColor, true)
      .addField('RGB', rgb, true)
      .addField('Colour contrast (dark mode)', contrast, true)
      .addField('People with this role', members.size, true);

    return message.channel.send(embed);
  };

  documentation = {
    examples: [
      {
        args: '<role>',
        description: 'Shows information about the specified role.',
      },
    ],
    requiresMod: false,
  };
}
