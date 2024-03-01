/**
 * Check if a date is valid, i.e. not "Invalid Date"
 * @param date
 */
export const isValidDate = (date: Date) => {
  return date instanceof Date && !isNaN(date.getTime())
}

export const getDayCountThisYear = (): number => {
  const year = new Date().getFullYear();
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
}


export const isLeapYear = (): boolean => getDayCountThisYear() === 366

