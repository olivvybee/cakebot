import Discord from 'discord.js';
import { config as loadEnv } from 'dotenv';

import { Log } from './utils/logging';
import { pluralise } from './utils/plural';

import { commands } from './commands';
import { CommandModule } from './interfaces';

export class Client extends Discord.Client {
  commandModules: CommandModule[] = [];

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

  initialiseCommands = async () => {
    this.commandModules = commands;

    const commandCount = this.commandModules
      .map(commandModule => commandModule.commands.length)
      .reduce((acc, val) => acc + val, 0);
    Log.green(
      'Client',
      `Loaded ${pluralise(commandCount, 'command')} in ${pluralise(
        this.commandModules.length,
        'module'
      )}.`
    );
  };

  initialiseListeners = async () => {};
}
