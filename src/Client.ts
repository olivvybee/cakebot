import Discord from 'discord.js';

export class Client extends Discord.Client {
  constructor(options?: Discord.ClientOptions) {
    super(options);

    this.initialiseDatabase();
    this.initialiseCommands();
    this.initialiseListeners();
  }

  initialiseDatabase = () => {};

  initialiseCommands = () => {};

  initialiseListeners = () => {};
}
