export const pluralise = (number: number, unit: string, plural?: string) => {
  const pluralisedUnit = !!plural ? plural : `${unit}s`;
  return number === 1 ? `${number} ${unit}` : `${number} ${pluralisedUnit}`;
};
