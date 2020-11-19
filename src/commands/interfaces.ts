import { Command as AkairoCommand } from 'discord-akairo';

import { Client } from '../index';

import { createLogFunctions } from '../utils/logging';

interface Example {
  args: string;
  description: string;
}

export class Command extends AkairoCommand {
  public declare client: Client;

  public examples: Example[] = [];

  protected log = createLogFunctions(`command.${this.id}`);

  protected error = (message: string) => {
    this.log.red(`Error: ${message}`);
  };
}
