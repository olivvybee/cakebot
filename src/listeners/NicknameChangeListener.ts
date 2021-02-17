import { GuildMember } from 'discord.js';

import { updateBirthdayList } from '../commands/birthday/update-list';
import { Listener } from './interfaces';

export default class NicknameChangeListener extends Listener {
  constructor() {
    super('nicknameChange', {
      emitter: 'client',
      event: 'guildMemberUpdate',
    });
  }

  exec = (oldMember: GuildMember, newMember: GuildMember) => {
    if (oldMember.nickname === newMember.nickname) {
      return;
    }

    const serverId = newMember.guild.id;

    this.log(`Nickname for ${newMember.id} changed in ${serverId}`);
    updateBirthdayList(serverId);
  };
}
