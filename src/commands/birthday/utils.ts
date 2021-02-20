interface Birthdays {
  [user: string]: {
    month: number;
    day: number;
  };
}

interface BirthdaysByMonth {
  [month: string]: {
    [day: string]: string[];
  };
}

export const groupBirthdaysByMonth = (dates: Birthdays): BirthdaysByMonth =>
  Object.keys(dates).reduce((birthdays: BirthdaysByMonth, userId) => {
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
  }, {});
