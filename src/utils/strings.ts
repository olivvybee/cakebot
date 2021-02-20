export const pluralise = (count: number, unit: string, plural?: string) => {
  const pluralisedUnit = plural || `${unit}s`;
  return count === 1 ? `1 ${unit}` : `${count} ${pluralisedUnit}`;
};

export const formatList = (list: string[], joinWord: string = 'and') => {
  if (list.length === 0) {
    return '';
  }

  if (list.length === 1) {
    return list[0];
  }

  if (list.length === 2) {
    return `${list[0]} ${joinWord} ${list[1]}`;
  }

  const commaSeparated = list.slice(0, -1).join(', ');
  const lastItem = list.slice(-1).join('');

  return `${commaSeparated}, ${joinWord} ${lastItem}`;
};
