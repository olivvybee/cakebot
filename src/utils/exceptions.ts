import { createLogFunction } from './logging';

const logError = createLogFunction('exception', 'error');

export const logException = async (error: Error) => {
  const { stack, name, message, ...properties } = error;

  const stackLines = stack
    ?.split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('at'))
    .slice(0, 3)
    .join('\n    ');

  let output = `${name}`;

  if (message) {
    const formattedMessage = message.replace(/\n/g, '\n    ');
    output += `\n↳ Message:\n    ${formattedMessage}`;
  }

  if (stackLines) {
    output += `\n↳ Stack trace:\n    ${stackLines}`;
  }

  if (Object.keys(properties).length > 0) {
    const propertyLines = Object.entries(properties)
      .map(([key, value]) => `↳ ${key}:\n    ${value}`)
      .join('\n');
    output += `\n${propertyLines}`;
  }

  logError(output);
};
