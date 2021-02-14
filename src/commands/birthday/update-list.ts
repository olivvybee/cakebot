import { TextChannel } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { client } from '../..';
import { getUsername } from '../../utils/users';
import { MONTH_NAMES } from './constants';

interface BirthdaysByMonth {
  [month: string]: {
    [day: string]: string[];
  };
}

export const updateBirthdayList = async (serverId: string) => {
  const { channel: channelId, listMessage: listMessageId, dates } =
    (await client.database.get(serverId, 'birthdays')) || {};
  console.log({ channelId, listMessageId, dates });

  if (!channelId) {
    client.log.red(`No birthday channel set for ${serverId}`);
    return;
  }

  if (!dates) {
    client.log.red(`No birthdays saved for ${serverId}`);
    return;
  }

  const channel = await client.channels.fetch(channelId);

  const embed = new MessageEmbed();
  embed.setTitle('Server birthdays');

  const birthdaysByMonth: BirthdaysByMonth = Object.keys(dates).reduce(
    (birthdays: BirthdaysByMonth, userId) => {
      const { month, day } = dates[userId];

      const monthObject = birthdays[month] || {};
      const dayList = monthObject[day] || [];

      dayList.push(userId);

      return {
        ...birthdays,
        [month]: {
          ...birthdays[month],
          [day]: dayList,
        },
      };
    },
    {}
  );

  for (let month = 0; month < 12; month++) {
    const monthName = MONTH_NAMES[month];
    const monthBirthdays = birthdaysByMonth[month.toString()];

    if (!monthBirthdays) {
      embed.addField(monthName, '\u200B\n\u200B', false);
      continue;
    }

    const list = Object.keys(monthBirthdays).reduce((result, day) => {
      const dayBirthdays = monthBirthdays[day]
        .map((userId: string) => getUsername(serverId, userId))
        .filter((item) => !!item)
        .join(', ');

      if (dayBirthdays.length === 0) {
        return result;
      }

      return `${result}\n${day}: ${dayBirthdays}`;
    }, '');

    const monthText = list.length > 0 ? list : `\u200B`;
    embed.addField(monthName, monthText, false);
  }

  if (listMessageId) {
    try {
      const existingMessage = await (channel as TextChannel).messages.fetch(
        listMessageId
      );
      return existingMessage.edit(embed);
    } catch (error) {
      client.log.blue(
        `List message ${listMessageId} appears to have been deleted, creating a new one for ${serverId}`
      );
    }
  }

  const newMessage = await (channel as TextChannel).send(embed);
  client.database.set(newMessage.id, serverId, 'birthdays/listMessage');
};
