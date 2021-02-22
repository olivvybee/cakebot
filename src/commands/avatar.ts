import { GuildMember, Message, MessageEmbed } from 'discord.js';

import { Command } from './interfaces';

interface AvatarArgs {
  user: GuildMember | null;
}

export default class Avatar extends Command {
  constructor() {
    super('avatar', {
      aliases: ['avatar'],
      args: [{ id: 'user', type: 'member' }],
      channel: 'guild',
      description: "Shows a person's avatar.",
    });
  }

  exec = (message: Message, args: AvatarArgs) => {
    const target = args.user || message.member!;

    const { displayName, displayHexColor, user } = target;

    const imageUrl = user.displayAvatarURL({
      format: 'png',
      dynamic: true,
    });

    if (!imageUrl) {
      this.error('Failed to fetch avatar url');
      return message.channel.send("I wasn't able to get that person's avatar.");
    }

    const embed = new MessageEmbed();
    embed.setTitle(`Avatar for ${displayName}`);
    embed.setColor(displayHexColor);
    embed.setImage(imageUrl);

    return message.channel.send(embed);
  };

  documentation = {
    examples: [
      {
        args: '',
        description: 'Shows your own avatar.',
      },
      {
        args: '<user>',
        description: 'Shows the avatar for the specified person.',
      },
    ],
    requiresMod: false,
  };
}
