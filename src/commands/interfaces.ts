import { Command as AkairoCommand } from 'discord-akairo';

import { Client } from '../index';

import { createLogFunctions } from '../utils/logging';

interface Example {
  args: string;
  description: string;
}

interface Documentation {
  examples: Example[];
  requiresMod: boolean;
  parentCommand?: boolean;
}

export abstract class Command extends AkairoCommand {
  public declare client: Client;

  public abstract documentation: Documentation;

  protected log = createLogFunctions(`command.${this.id}`);

  protected error = (message: string) => {
    this.log.red(`Error: ${message}`);
  };
}
