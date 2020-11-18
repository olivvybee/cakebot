import { Listener } from './interfaces';

export default class OnReadyListener extends Listener {
  constructor() {
    super('onReady', {
      emitter: 'client',
      event: 'ready',
    });
  }

  exec() {
    const tag = this.client.user?.tag;
    this.log.green(`Logged in as ${tag}`);
  }
}
