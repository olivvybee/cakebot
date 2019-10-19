import Discord from 'discord.js';
import { config as loadEnv } from 'dotenv';

import { Log } from './utils/logging';
import { pluralise } from './utils/plural';

import { commands } from './commands';
import { listeners } from './listeners';
import { CommandModule } from './interfaces';
import { Listener } from './interfaces/Listener';

export class Client extends Discord.Client {
  commandModules: CommandModule[] = [];
  eventListeners: Listener<any>[] = [];

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

    const commandList = this.commandModules
      .map(commandModule => {
        const subCommands = commandModule.commands
          .map(command => command.displayName)
          .join(', ');
        return `${commandModule.displayName}: ${subCommands}`;
      })
      .join('\n');
    Log.continued(commandList);
  };

  initialiseListeners = async () => {
    this.eventListeners = listeners;

    this.eventListeners.forEach(listener => {
      this.on(listener.event, (...params: any[]) =>
        listener.callback(this, ...params)
      );
    });

    Log.green(
      'Client',
      `Loaded ${pluralise(this.eventListeners.length, 'event listener')}.`
    );

    const groupedListeners = this.eventListeners.reduce<{
      [event: string]: string[];
    }>(
      (listenersByEvent, listener) => ({
        ...listenersByEvent,
        [listener.event]: !!listenersByEvent[listener.event]
          ? [...listenersByEvent[listener.event], listener.displayName]
          : [listener.displayName]
      }),
      {}
    );

    const listenerList = Object.keys(groupedListeners)
      .map(event => `${event}: ${groupedListeners[event].join(', ')}`)
      .join('\n');
    Log.continued(listenerList);
  };
}
