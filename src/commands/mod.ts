import { MessageEmbed } from 'discord.js';
import { Role, Message } from 'discord.js';

import { Command } from './interfaces';

interface ModArgs {
  action: 'add' | 'remove' | null;
  role: Role | null;
}

export default class Mod extends Command {
  constructor() {
    super('mod', {
      aliases: ['mod', 'moderator'],
      args: [
        { id: 'action', type: ['add', 'remove'] },
        { id: 'role', type: 'role' },
      ],
      channel: 'guild',
      description:
        'Adds or removes mod access from a certain role. This only affects Cakebot commands; it does not give mod permissions for the entire server.',
    });
  }

  exec = (message: Message, args: ModArgs) => {
    const { action, role } = args;

    if (!action) {
      this.error('No action specified.');
      return message.channel.send(
        'You need to tell me whether to add or remove mod permissions.'
      );
    }

    if (role === null) {
      this.error('No role specified.');
      return message.channel.send('You need to tell me which role to modify.');
    }

    if (role === undefined) {
      this.error('Invalid role specified.');
      return message.channel.send("I can't find that role.");
    }

    if (action === 'add') {
      return this.addMod(role, message);
    }

    if (action === 'remove') {
      return this.removeMod(role, message);
    }

    this.error('Invalid action specified.');
    return message.channel.send(
      'You need to tell me whether to add or remove mod permissions.'
    );
  };

  addMod = async (role: Role, message: Message) => {
    const serverId = message.guild!.id;

    const existingRoles = await this.client.database.getArray(
      serverId,
      'modRoles'
    );
    if (!existingRoles?.includes(role.id)) {
      await this.client.database.push(role.id, serverId, 'modRoles');
    }

    const embed = new MessageEmbed();
    embed.setTitle('Mod permissions added');
    embed.setDescription(`${role} now has mod permissions.`);
    embed.setColor(role.color);
    return message.channel.send(embed);
  };

  removeMod = async (role: Role, message: Message) => {
    const serverId = message.guild!.id;

    const roles = await this.client.database.get(serverId, 'modRoles');
    if (roles) {
      const matchedKey = Object.keys(roles).find(
        (key) => roles[key] === role.id
      );
      if (matchedKey) {
        await this.client.database.delete(serverId, `modRoles/${matchedKey}`);
      }
    }

    const embed = new MessageEmbed();
    embed.setTitle('Mod permissions removed');
    embed.setDescription(`${role} no longer has mod permissions.`);
    embed.setColor(role.color);
    return message.channel.send(embed);
  };

  examples = [
    {
      args: 'add <role>',
      description:
        'Gives the specified role mod permissions for cakebot commands.',
    },
    {
      args: 'remove <role>',
      description: 'Removes mod permissions for the specified role.',
    },
  ];
}
