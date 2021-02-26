import Dayjs from 'dayjs';
import Duration from 'dayjs/plugin/duration';

import { pluralise } from './strings';

Dayjs.extend(Duration);

export const timeSince = (date: Date) => {
  const now = Dayjs();
  const diff = Dayjs.duration(now.diff(date));

  const components = {
    years: diff.years(),
    months: diff.months(),
    days: diff.days(),
    hours: diff.hours(),
    minutes: diff.minutes(),
    seconds: diff.seconds(),
  };

  const pluralised = Object.entries(components).map(([key, value]) => {
    const unit = key.slice(0, -1);
    return pluralise(value, unit);
  });

  const firstNonZeroIndex = Object.values(components).findIndex(
    (value) => value !== 0
  );

  const asString = pluralised.slice(firstNonZeroIndex).join(', ');

  return {
    ...components,
    asString,
  };
};
