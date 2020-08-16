import path from 'path';

import { AkairoClient, ListenerHandler } from 'discord-akairo';
import chalk from 'chalk';
import { config as loadEnv } from 'dotenv';

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

class Client extends AkairoClient {
  public listenerHandler: ListenerHandler;

  constructor() {
    super(
      {
        ownerID: process.env.DISCORD_OWNER_ID,
      },
      {
        disableMentions: 'everyone',
      }
    );

    this.listenerHandler = new ListenerHandler(this, {
      directory: modulePath('listeners'),
    });
  }

  async login(token?: string) {
    const result = await super.login(token);
    this.listenerHandler.loadAll();
    return result;
  }
}

const client = new Client();
client.login(process.env.DISCORD_BOT_TOKEN);
