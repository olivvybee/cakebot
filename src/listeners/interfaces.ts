import { Listener as AkairoListener } from 'discord-akairo';

import { Client } from '../index';

import { createLogFunctions } from '../utils/logging';

export class Listener extends AkairoListener {
  public declare client: Client;

  protected log = createLogFunctions(`listener.${this.id}`);
}
