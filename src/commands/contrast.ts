import { Message, MessageEmbed, MessageAttachment } from 'discord.js';
import Color from 'color';
import { createCanvas } from 'canvas';

import { CONTRAST_THRESHOLD } from '../constants';
import { getContrastString } from '../utils/colour';

import { Command } from './interfaces';

interface ContrastArgs {
  colourA: string | null;
  colourB: string | null;
}

export default class Contrast extends Command {
  constructor() {
    super('contrast', {
      aliases: ['contrast'],
      args: [
        { id: 'colourA', type: 'color' },
        { id: 'colourB', type: 'color' },
      ],
      channel: 'guild',
      description: 'Calculates the contrast between two colours.',
    });
  }

  exec = (message: Message, args: ContrastArgs) => {
    const { colourA, colourB } = args;

    if (colourA === null || colourB === null) {
      return message.channel.send(
        'You need to specify two colours, in hex format (e.g. `#abc123`).'
      );
    }

    const parsedA = Color(colourA);
    const parsedB = Color(colourB);

    const a = parsedA.hex();
    const b = parsedB.hex();

    const mixed = parsedA.mix(parsedB).hex();

    const contrast = getContrastString(a, b);

    const canvas = createCanvas(256, 256);
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 128px sans-serif';
    ctx.fillStyle = a;
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = b;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Aa', 128, 128);
    const image = canvas.toBuffer();

    const embed = new MessageEmbed()
      .setTitle(`Colour contrast between ${a} and ${b}`)
      .setDescription(contrast)
      .setColor(mixed)
      .setFooter(`Minimum for WCAG 2.1 AA is ${CONTRAST_THRESHOLD}`)
      .attachFiles([new MessageAttachment(image, 'example.png')])
      .setThumbnail('attachment://example.png');

    return message.channel.send(embed);
  };

  documentation = {
    examples: [
      {
        args: '<colourA> <colourB>',
        description: 'Calculates the contrast between colourA and colourB.',
      },
    ],
    requiresMod: false,
  };
}
