import path from 'path';

import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import chalk from 'chalk';
import { config as loadEnv } from 'dotenv';
import { Database } from './database/Database';

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
}

const client = new Client();
client.login(process.env.DISCORD_BOT_TOKEN);
