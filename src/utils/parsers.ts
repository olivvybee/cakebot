import { Guild } from 'discord.js';

export const parseChannel = (text: string, guild: Guild) => {
  if (text.startsWith('#')) {
    return guild.channels.find(
      channel => channel.name.toLowerCase() === text.slice(1).toLowerCase()
    );
  }

  const regexMatch = text.match(/<#(\d+)>/);
  if (regexMatch) {
    return guild.channels.get(regexMatch[1]);
  }

  return undefined;
};
