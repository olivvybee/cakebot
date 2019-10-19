import { Message, TextChannel, Guild, GuildMember } from 'discord.js';
import { Client } from '../Client';

export interface Parameter {
  name: string;
  optional?: boolean;
  multipleWords?: boolean;
}

export interface RunFunctionParams<Params> {
  params: Params;
  message: Message;
  channel: TextChannel;
  guild: Guild;
  author: GuildMember;
  client: Client;
}

export type RunFunction<Params> = (
  params: RunFunctionParams<Params>
) => Promise<void>;

export interface Example {
  usage: string;
  description: string;
}

export interface Command<Params> {
  run: RunFunction<Params>;
  name: string;
  params: Parameter[];
  description: string;
  examples: Example[];
  aliases?: string[];
  requiresMod?: boolean;
}

export interface CommandModule {
  name: string;
  description: string;
  commands: Command<any>[];
}
