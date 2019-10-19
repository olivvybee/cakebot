import { Message } from 'discord.js';
import { Listener, ListenerCallback } from '../interfaces/Listener';

type CommandListenerParams = [Message];

const CommandListener: Listener<CommandListenerParams> = {
  displayName: 'CommandListener',
  event: 'message',

  callback: async (client, message) => {
    console.log('Received message:', message.content);
  }
};

export default CommandListener;
