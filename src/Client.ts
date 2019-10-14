import Discord from 'discord.js';
import { config as loadEnv } from 'dotenv';

import { Log } from './utils/logging';
import { pluralise } from './utils/plural';

export class Client extends Discord.Client {
  constructor(options?: Discord.ClientOptions) {
    super(options);
  }

  initialise = async () => {
    loadEnv();

    await this.login(process.env.DISCORD_BOT_TOKEN);
    await this.initialiseDatabase();
    await this.initialiseCommands();
    await this.initialiseListeners();

    const guildCount = pluralise(this.guilds.size, 'guild');
    Log.green('Client', `Logged in as ${this.user.tag} in ${guildCount}.`);
  };

  initialiseDatabase = async () => {};

  initialiseCommands = async () => {};

  initialiseListeners = async () => {};
}
