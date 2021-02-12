import { Message } from 'discord.js';
import dayjs from 'dayjs';

import { Command } from '../interfaces';

import { MONTH_NAMES, SEPARATORS, VALID_DAYS } from './constants';

interface BirthdaySetArgs {
  date: string;
}

export default class BirthdaySet extends Command {
  constructor() {
    super('birthday-set', {
      args: [{ id: 'date', match: 'content' }],
      channel: 'guild',
      category: 'birthday',
      description: 'Adds your birthday to the birthdays list.',
    });
  }

  exec = (message: Message, args: BirthdaySetArgs) => {
    const { date } = args;

    if (!date) {
      return;
    }

    let month;
    let day;
    let ambiguous = false;

    const separator = SEPARATORS.find((separator) => date.includes(separator));
    if (separator) {
      const parts = date.split(separator);
      const first = parseInt(parts[0]);
      const second = parseInt(parts[1]);

      if (first > 31 || second > 31) {
        month = undefined;
        day = undefined;
      } else if (first <= 12 && second <= 12) {
        month = first - 1;
        day = second;
        if (first !== second) {
          ambiguous = true;
        }
      } else if (first <= 12 && second > 12) {
        month = first - 1;
        day = second;
      } else if (first > 12 && second <= 12) {
        month = second - 1;
        day = first;
      }
    } else {
      const parsedDate = dayjs(`${date} UTC`);
      if (parsedDate.isValid()) {
        month = parsedDate.month();
        day = parsedDate.date();
      }
    }

    if (month === undefined || day === undefined || day > VALID_DAYS[month]) {
      this.error(`Failed to parse date "${date}"`);
      return message.channel.send(
        `I didn't understand the date you entered. Try something like \`12/25\` or \`25 Dec\`.`
      );
    }

    const userId = message.author.id;
    const serverId = message.guild!.id;

    this.client.database.set(
      { month, day },
      serverId,
      `birthdays/dates/${userId}`
    );
    this.log.blue(
      `Birthday for ${userId} in ${serverId} set to month=${month} day=${day}`
    );

    let reply = `Birthday saved as ${day} ${MONTH_NAMES[month]}!`;
    if (ambiguous) {
      const reversed = `${month + 1} ${MONTH_NAMES[day - 1]}`;
      reply += ` If you meant ${reversed} instead, try entering the date as \`${reversed}\`.`;
    }

    message.channel.send(reply);
  };

  documentation = {
    examples: [],
    requiresMod: false,
  };
}
