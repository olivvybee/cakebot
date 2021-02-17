import path from 'path';

import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import chalk from 'chalk';
import { config as loadEnv } from 'dotenv';
import { Guild, GuildMember } from 'discord.js';

import { Database } from './database/Database';
import { createLogFunction } from './utils/logging';

loadEnv();

const ownerID = process.env.DISCORD_OWNER_ID;
const botToken = process.env.DISCORD_BOT_TOKEN;

if (!ownerID) {
  console.log(
    chalk.red('[client] Error: DISCORD_OWNER_ID environment variable not set.')
  );
  process.exit(1);
}

if (!botToken) {
  console.log(chalk.red('DISCORD_BOT_TOKEN environment variable not set.'));
  process.exit(1);
}

const modulePath = (relativePath: string) => path.join(__dirname, relativePath);

export class Client extends AkairoClient {
  public listenerHandler: ListenerHandler;
  public commandHandler: CommandHandler;
  public database: Database;

  constructor() {
    super(
      {
        ownerID: process.env.DISCORD_OWNER_ID,
      },
      {
        disableMentions: 'everyone',
      }
    );

    this.commandHandler = new CommandHandler(this, {
      directory: modulePath('commands'),
      prefix: '!cb ',
      allowMention: true,
      blockBots: false,
    });

    this.listenerHandler = new ListenerHandler(this, {
      directory: modulePath('listeners'),
    });

    this.database = new Database();
  }

  log = {
    system: createLogFunction('client', 'system'),
    permissions: createLogFunction('client', 'permissions'),
  };

  async login(token?: string) {
    const result = await super.login(token);

    this.commandHandler.loadAll();
    this.commandHandler.useListenerHandler(this.listenerHandler);

    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
    });
    this.listenerHandler.loadAll();

    return result;
  }

  isMod = async (user: GuildMember) => {
    const serverId = user.guild.id;
    this.log.permissions(`Checking if ${user.id} is a mod in ${serverId}.`);
    const modRoles = await this.database.getArray(user.guild.id, 'modRoles');
    if (!modRoles || !modRoles.length) {
      this.log.permissions(`${serverId} does not use mod roles.`);
      return true;
    }

    if (user.roles.cache.some((role) => modRoles.includes(role.id))) {
      this.log.permissions(`${user.id} is a mod in ${serverId}.`);
      return true;
    } else {
      this.log.permissions(`${user.id} is not a mod in ${serverId}.`);
      return false;
    }
  };

  serverUsesMods = async (server: Guild) => {
    this.log.permissions(`Checking if ${server.id} uses mod roles.`);
    const modRoles = await this.database.getArray(server.id, 'modRoles');
    if (!!modRoles && modRoles.length > 0) {
      this.log.permissions(`${server.id} uses mod roles.`);
      return true;
    } else {
      this.log.permissions(`${server.id} does not use mod roles.`);
      return false;
    }
  };
}

export const client = new Client();
client.login(process.env.DISCORD_BOT_TOKEN);
