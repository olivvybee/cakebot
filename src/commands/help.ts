import { Message, MessageEmbed } from 'discord.js';

import { Command } from './interfaces';

interface HelpArgs {
  commandName: string | null;
}

export default class Help extends Command {
  constructor() {
    super('help', {
      aliases: ['help'],
      args: [{ id: 'commandName', type: 'string' }],
      description: 'Gives instructions on how to use my commands.',
    });
  }

  exec = (message: Message, args: HelpArgs) => {
    const { commandName } = args;

    if (commandName) {
      return this.showSingleCommand(commandName, message);
    } else {
      return this.showAllCommands(message);
    }
  };

  private showAllCommands = (message: Message) => {
    const commands = this.client.commandHandler.modules;

    const modCommands = commands.filter(
      (command) => (command as Command).documentation.requiresMod
    );
    const nonModCommands = commands.difference(modCommands);

    const modText = modCommands.array().length
      ? ' Commands marked with 🔒 require mod permissions.'
      : '';

    const embed = new MessageEmbed();
    embed.setTitle('Cakebot help');
    embed.setDescription(
      `These are all the commands I understand. Remember to use ${this.client.commandHandler.prefix} at the start of your command.${modText}`
    );

    nonModCommands.forEach((command) => {
      const name = command.aliases[0];
      const description = command.description || 'No overview available.';

      embed.addField(name, description);
    });

    modCommands.forEach((command) => {
      const name = command.aliases[0];
      const description = command.description || 'No overview available.';

      embed.addField(`${name} 🔒`, description);
    });

    // TODO: Maybe send by DM to avoid revealing mod-only commands
    return message.channel.send(embed);
  };

  private showSingleCommand = (commandName: string, message: Message) => {
    const command = this.client.commandHandler.findCommand(commandName);
    if (!command) {
      this.error(`No command named ${commandName}.`);
      return message.channel.send(
        `I don't have a command named "${commandName}".`
      );
    }

    const { description, documentation } = command as Command;

    const descriptionText = description || 'No overview available.';
    const modText = documentation.requiresMod
      ? '🔒 This command requires mod permissions.\n\n'
      : '';

    const embed = new MessageEmbed();
    embed.setTitle(`${commandName}`);
    embed.setDescription(`${modText}${descriptionText}\n\u200B`);
    documentation.examples.forEach((example) => {
      embed.addField(
        `${this.client.commandHandler.prefix}${commandName} ${example.args}`,
        example.description
      );
    });

    return message.channel.send(embed);
  };

  documentation = {
    examples: [
      {
        args: '',
        description: 'Lists all available commands.',
      },
      {
        args: '<command>',
        description: 'Shows help for a specific command.',
      },
    ],
    requiresMod: false,
  };
}
