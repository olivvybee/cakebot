export const randomInt = (max: number) => Math.floor(Math.random() * max);

export const pickRandom = <T>(list: T[]): T => {
  const index = randomInt(list.length);
  return list[index];
};
