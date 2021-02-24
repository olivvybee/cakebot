import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import { pickRandom } from '../utils/random';
import { Command } from './interfaces';

interface EightBallArgs {
  question: string | null;
}

enum ResponseType {
  Positive,
  Neutral,
  Negative,
}

const RESPONSES = [
  { response: 'It is certain.', type: ResponseType.Positive },
  { response: 'It is decidedly so.', type: ResponseType.Positive },
  { response: 'Without a doubt.', type: ResponseType.Positive },
  { response: 'You may rely on it.', type: ResponseType.Positive },
  { response: 'As I see it, yes.', type: ResponseType.Positive },
  { response: 'Most likely.', type: ResponseType.Positive },
  { response: 'Outlook good.', type: ResponseType.Positive },
  { response: 'Yes.', type: ResponseType.Positive },
  { response: 'Signs point to yes.', type: ResponseType.Positive },
  { response: 'Reply hazy, try again.', type: ResponseType.Neutral },
  { response: 'Ask again later.', type: ResponseType.Neutral },
  { response: "I'd rather get *your* opinion.", type: ResponseType.Neutral },
  { response: 'Cannot predict now.', type: ResponseType.Neutral },
  { response: 'Concentrate and ask again.', type: ResponseType.Neutral },
  { response: "Don't count on it.", type: ResponseType.Negative },
  { response: 'My reply is no.', type: ResponseType.Negative },
  { response: 'My sources say no.', type: ResponseType.Negative },
  { response: 'Outlook not so good.', type: ResponseType.Negative },
  { response: 'Very doubtful.', type: ResponseType.Negative },
];

const COLOURS = {
  [ResponseType.Positive]: '#60b643',
  [ResponseType.Neutral]: '#ffd700',
  [ResponseType.Negative]: '#ff1f1f',
};

export default class EightBall extends Command {
  constructor() {
    super('eightball', {
      aliases: ['eightball', '8ball'],
      args: [{ id: 'question', type: 'string' }],
      channel: 'guild',
      description: 'Answers a yes or no question using the magic 8 ball.',
    });
  }

  exec = (message: Message, args: EightBallArgs) => {
    const { question } = args;

    if (!question) {
      return message.channel.send(
        'You need to ask a question for the magic 8 ball to answer.'
      );
    }

    const { response, type } = pickRandom(RESPONSES);
    const colour = COLOURS[type];

    const embed = new MessageEmbed().setDescription(response).setColor(colour);

    return message.channel.send(embed);
  };

  documentation = {
    examples: [
      { args: '<question>', description: 'Asks the magic 8 ball a question.' },
    ],
    requiresMod: false,
  };
}
