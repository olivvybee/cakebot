import { AkairoClient } from 'discord-akairo';
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

class Client extends AkairoClient {
  constructor() {
    super(
      {
        ownerID: process.env.DISCORD_OWNER_ID,
      },
      {
        disableMentions: 'everyone',
      }
    );
  }
}

const client = new Client();
client.login(process.env.DISCORD_BOT_TOKEN);
