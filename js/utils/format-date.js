const defaultDateOptions = {
  day: 'numeric',
  weekday: 'long',
  month: 'long',
}

export function formatDate(date, options = defaultDateOptions) {
  return new Intl.DateTimeFormat('es', options).format(date);
}

export function formatTemp(value) {
  return `${Math.floor(value)}°`;
}

export function formatSpeed(value) {
  return `${Math.floor(value)} km-h`;
}

export function formatWeekList(rawData) {
  // let dayList = [];
  const weekList = [];

  /* rawData.forEach((item, index) => {
  //   dayList.push(item);
  //   if((index + 1) % 8 === 0) {
  //     weekList.push(dayList);
  //     dayList = [];
  //   }
  // })*/

  while (rawData.length > 0) {
    weekList.push(rawData.splice(0, 8))
  }
  return weekList;
}