import { Command as AkairoCommand } from 'discord-akairo';

import { Client } from '../index';

import { createLogFunction } from '../utils/logging';

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

  protected log = createLogFunction(`command.${this.id}`, 'command');

  protected error = (message: string) => {
    this.log(`Error: ${message}`);
  };
}
