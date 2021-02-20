export const isNotUndefined = <T>(item: T | undefined): item is T =>
  item !== undefined;
