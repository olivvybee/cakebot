import { TextChannel } from 'discord.js';
import { Message, Channel } from 'discord.js';

import { Command } from '../interfaces';
import { updateBirthdayList } from './update-list';

interface BirthdayChannelArgs {
  channel: Channel;
}

export default class BirthdayChannel extends Command {
  constructor() {
    super('birthday-channel', {
      args: [{ id: 'channel', type: 'textChannel' }],
      description: 'Sets the channel to post the birthday list in.',
      channel: 'guild',
    });
  }

  userPermissions = async (message: Message) => {
    const isMod = await this.client.isMod(message.member!);
    return isMod ? null : 'Mod role';
  };

  exec = async (message: Message, args: BirthdayChannelArgs) => {
    const { channel } = args;
    if (!channel) {
      this.error('No channel specified');
      return message.channel.send(
        'I need to know which channel to use, and it must be a text channel.'
      );
    }

    const serverId = message.guild!.id;

    const existingChannelId = await this.client.database.get(
      serverId,
      'birthdays/channel'
    );
    if (existingChannelId && existingChannelId !== channel.id) {
      const pinId = await this.client.database.get(
        serverId,
        'birthdays/listMessage'
      );
      if (pinId) {
        const channel = await this.client.channels.fetch(existingChannelId);
        const pinnedMessage = await (channel as TextChannel).messages.fetch(
          pinId
        );
        await pinnedMessage.delete();
        await this.client.database.delete(serverId, 'birthdays/channel');
        await this.client.database.delete(serverId, 'birthdays/listMessage');
        this.log.blue(`Deleted pinned birthday list ${pinId} for ${serverId}`);
      }

      this.client.database.set(channel.id, serverId, 'birthdays/channel');
      this.log.blue(`Birthday channel for ${serverId} set to ${channel.id}`);

      await updateBirthdayList(serverId);

      return message.channel.send(`Birthday list created in ${channel}!`);
    } else {
      this.log.blue(
        `Birthday channel for ${serverId} is already set to ${channel.id}`
      );
      return message.channel.send(
        'The birthday list is already in that channel.'
      );
    }
  };

  documentation = {
    examples: [],
    requiresMod: true,
  };
}
