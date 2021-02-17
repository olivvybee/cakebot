import { client } from '../';
import { createLogFunction } from './logging';

const log = createLogFunction('userUtils', 'utility');

export const getUsername = (serverId: string, userId: string) => {
  try {
    const server = client.util.resolveGuild(serverId, client.guilds.cache);
    const user = client.util.resolveMember(userId, server.members.cache);
    return user.displayName;
  } catch (error) {
    log(`Failed to lookup username for ${userId} in ${serverId}: ${error}`);
    return undefined;
  }
};
