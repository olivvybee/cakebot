import { Command as AkairoCommand } from 'discord-akairo';

import { Client } from '../index';

import { createLogFunctions } from '../utils/logging';

export class Command extends AkairoCommand {
  public declare client: Client;

  protected log = createLogFunctions(`command.${this.id}`);

  protected error = (message: string) => {
    this.log.red(`Error: ${message}`);
  };
}
