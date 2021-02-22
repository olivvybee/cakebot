import { Message } from 'discord.js';
import dayjs from 'dayjs';

import { Command } from '../interfaces';

import { groupBirthdaysByMonth } from './utils';
import { getUsername } from '../../utils/users';
import { formatList, pluralise } from '../../utils/strings';
import { isNotUndefined } from '../../utils/isNotUndefined';
import { timeStamp } from 'console';

export default class BirthdayNext extends Command {
  constructor() {
    super('birthday-next', {
      description: 'Displays who has the next birthday in the server.',
      channel: 'guild',
    });
  }

  exec = async (message: Message) => {
    const serverId = message.guild!.id;

    const dates = await this.client.database.get(serverId, 'birthdays/dates');

    if (!dates || Object.keys(dates).length === 0) {
      return message.channel.send('No birthdays have been saved.');
    }

    const birthdaysByMonth = groupBirthdaysByMonth(dates);

    let date = dayjs();
    let foundBirthdays: string[] = [];

    for (let i = 0; i < 366; i++) {
      date = date.add(1, 'day');
      const month = date.get('month');
      const day = date.get('date');

      const birthdays = birthdaysByMonth[month]?.[day];

      if (birthdays && birthdays.length > 0) {
        foundBirthdays = birthdays;
        break;
      }
    }

    if (foundBirthdays.length === 0) {
      this.error(
        '`dates` is not undefined, but no birthdays found in the search.'
      );
      return message.channel.send("I couldn't find any upcoming birthdays.");
    }

    const names = foundBirthdays
      .map((userId) => getUsername(serverId, userId))
      .filter(isNotUndefined);

    if (names.length === 0) {
      this.error(
        '`foundBirthdays` is not empty, but nicknames could not be resolved.'
      );
      return message.channel.send("I couldn't find any upcoming birthdays.");
    }

    const list = formatList(names);
    const unit = names.length === 1 ? 'birthday' : 'birthdays';
    const formattedDate = date.format('DD MMMM');

    const reply = `The next ${unit} will be ${list} on ${formattedDate}.`;

    return message.channel.send(reply);
  };

  documentation = {
    examples: [
      {
        args: '',
        description: 'Displays who has the next birthday in the server.',
      },
    ],
    requiresMod: false,
  };
}
