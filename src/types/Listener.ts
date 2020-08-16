import { Listener as AkairoListener } from 'discord-akairo';

import { createLogFunctions } from '../utils/logging';

export class Listener extends AkairoListener {
  protected log = createLogFunctions(`listener.${this.id}`);
}
