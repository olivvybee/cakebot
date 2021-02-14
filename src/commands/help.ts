import { Collection } from 'discord.js';
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

  private showAllCommands = async (message: Message) => {
    const serverUsesMods = message.guild
      ? await this.client.serverUsesMods(message.guild)
      : false;
    const userIsMod =
      serverUsesMods && message.member
        ? await this.client.isMod(message.member)
        : true;

    const commands = this.client.commandHandler.modules;

    const modCommands = serverUsesMods
      ? commands.filter(
          (command) => (command as Command).documentation.requiresMod
        )
      : new Collection<string, Command>();
    const nonModCommands = commands.difference(modCommands);

    const modText =
      modCommands.array().length && userIsMod
        ? ' Commands marked with 🔒 require mod permissions.'
        : '';

    const embed = new MessageEmbed();
    embed.setTitle('Cakebot help');
    embed.setDescription(
      `These are all the commands I understand. Remember to use ${this.client.commandHandler.prefix} at the start of your command. To get help with a specific command, use \`${this.client.commandHandler.prefix}help <command>\`.${modText}`
    );

    nonModCommands.forEach((command) => {
      const name = command.aliases[0];
      const description = command.description || 'No overview available.';

      if (name) {
        embed.addField(name, description);
      }
    });

    if (userIsMod) {
      modCommands.forEach((command) => {
        const name = command.aliases[0];
        const description = command.description || 'No overview available.';

        if (name) {
          embed.addField(`${name} 🔒`, description);
        }
      });
    }

    // TODO: Maybe send by DM to avoid revealing mod-only commands
    return message.channel.send(embed);
  };

  private showParentCommand = async (command: Command, message: Message) => {
    const subcommands = this.client.commandHandler.modules.filter((module) =>
      module.id.startsWith(`${command.id}-`)
    );

    const serverUsesMods = message.guild
      ? await this.client.serverUsesMods(message.guild)
      : false;
    const userIsMod =
      serverUsesMods && message.member
        ? await this.client.isMod(message.member)
        : true;

    const modSubcommands = serverUsesMods
      ? subcommands.filter(
          (subcommand) => (subcommand as Command).documentation.requiresMod
        )
      : new Collection<string, Command>();
    const nonModSubcommands = subcommands.difference(modSubcommands);

    const descriptionText = command.description || 'No overview available.';

    const modText =
      modSubcommands.array().length && userIsMod
        ? ' Commands marked with 🔒 require mod permissions.'
        : '';

    const embed = new MessageEmbed();
    embed.setTitle(`${command.id}`);
    embed.setDescription(`${descriptionText}${modText}`);

    nonModSubcommands.forEach((subcommand) => {
      const name = subcommand.id.replace(`${command.id}-`, '');

      (subcommand as Command).documentation.examples.forEach((example) => {
        embed.addField(
          `${this.client.commandHandler.prefix}${command.id} ${name} ${example.args}`,
          example.description
        );
      });
    });

    if (userIsMod) {
      modSubcommands.forEach((subcommand) => {
        const name = subcommand.id.replace(`${command.id}-`, '');

        (subcommand as Command).documentation.examples.forEach((example) => {
          embed.addField(
            `${this.client.commandHandler.prefix}${command.id} ${name} ${example.args} 🔒`,
            example.description
          );
        });
      });
    }

    return message.channel.send(embed);
  };

  private showSingleCommand = async (commandName: string, message: Message) => {
    const command = this.client.commandHandler.findCommand(commandName);
    if (!command) {
      this.error(`No command named ${commandName}.`);
      return message.channel.send(
        `I don't have a command named "${commandName}".`
      );
    }

    const { description, documentation } = command as Command;

    if (documentation.parentCommand) {
      return this.showParentCommand(command as Command, message);
    }

    const serverUsesMods = message.guild
      ? await this.client.serverUsesMods(message.guild)
      : false;

    const descriptionText = description || 'No overview available.';
    const modText =
      serverUsesMods && documentation.requiresMod
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
