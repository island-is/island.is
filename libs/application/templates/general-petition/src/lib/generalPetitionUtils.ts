import addDays from 'date-fns/addDays'
import addYears from 'date-fns/addYears'
import { getHolidays } from 'fridagar'

const isWeekday = (date: Date) => {
  const day = date.getDay()
  return day !== 0 && day !== 6
}

export const getExcludedDates = (
  startDate = new Date(),
  endDate = addYears(new Date(), 1),
) => {
  const excludeDates = []
  const holidays = getHolidays(startDate.getFullYear())
  let currentDay = startDate
  while (currentDay <= endDate) {
    if (!isWeekday(currentDay)) {
      excludeDates.push(currentDay)
    }
    currentDay = addDays(currentDay, 1)
  }
  return [...excludeDates, ...holidays.map((holiday) => holiday.date)]
}
