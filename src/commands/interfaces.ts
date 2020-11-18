import { Command as AkairoCommand } from 'discord-akairo';

import { createLogFunctions } from '../utils/logging';

export class Command extends AkairoCommand {
  protected log = createLogFunctions(`command.${this.id}`);
}
