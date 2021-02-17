import { Listener as AkairoListener } from 'discord-akairo';

import { Client } from '../index';

import { createLogFunction } from '../utils/logging';

export class Listener extends AkairoListener {
  public declare client: Client;

  protected log = createLogFunction(`listener.${this.id}`, 'listener');
}
