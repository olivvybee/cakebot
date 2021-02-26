import dayjs from 'dayjs';
import Dayjs from 'dayjs';
import { Message, GuildMember, MessageEmbed } from 'discord.js';
import { timeSince } from '../utils/dates';

import { Command } from './interfaces';

interface UserArgs {
  user: GuildMember | null | undefined;
}

export default class User extends Command {
  constructor() {
    super('user', {
      aliases: ['user', 'member'],
      args: [{ id: 'user', type: 'member' }],
      channel: 'guild',
      description: 'Shows information about a person.',
    });
  }

  exec = async (message: Message, args: UserArgs) => {
    if (args.user === undefined) {
      return message.channel.send("I can't find that person.");
    }

    const user = args.user || message.member!;

    const {
      displayColor,
      displayName,
      joinedAt,
      roles,
      user: { tag, id },
    } = user;

    const avatarUrl = user.user.displayAvatarURL({
      format: 'png',
      dynamic: true,
      size: 1024,
    });

    const timeSinceJoining = joinedAt
      ? timeSince(joinedAt).asString.split(', ').slice(0, 2).join(', ')
      : 'Unknown';

    const joinDate = joinedAt
      ? Dayjs(joinedAt).format('D MMMM YYYY')
      : 'Unknown';

    const roleList = roles.cache
      .array()
      .filter((role) => role.name !== '@everyone')
      .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1))
      .join(' ');

    let birthday = 'Unknown';
    const { month, day } =
      (await this.client.database.get(
        message.guild!.id,
        `birthdays/dates/${id}`
      )) || {};
    if (month !== undefined && day !== undefined) {
      birthday = Dayjs().month(month).date(day).format('D MMMM');
    }

    const embed = new MessageEmbed()
      .setAuthor(displayName, avatarUrl)
      .setColor(displayColor)
      .addField('Discord tag', tag, true)
      .addField('User ID', id, true)
      .addField('Member for', timeSinceJoining, true)
      .addField('Joined', joinDate, true)
      .addField('Birthday', birthday, true)
      .addField('Roles', roleList || 'None');

    return message.channel.send(embed);
  };

  documentation = {
    examples: [
      { args: '', description: 'Shows information about yourself.' },
      {
        args: '<person>',
        description: 'Shows information about the specified person.',
      },
    ],
    requiresMod: false,
  };
}
