import addDays from 'date-fns/addDays'

const VERDICT_APPEAL_WINDOW_DAYS = 28
const FINE_APPEAL_WINDOW_DAYS = 3

const APPEAL_WINDOW_DAYS = 3

const setEndOfDay = (date: Date) => new Date(date.setHours(23, 59, 59, 999))

export const hasDatePassed = (deadline: Date) => Date.now() > deadline.getTime()

export const getIndictmentAppealDeadlineDate = (
  baseDate: Date,
  isFine?: boolean,
) => {
  const windowDays = isFine
    ? FINE_APPEAL_WINDOW_DAYS
    : VERDICT_APPEAL_WINDOW_DAYS
  const deadlineDate = addDays(baseDate, windowDays)
  return setEndOfDay(deadlineDate)
}

export const getAppealDeadlineDate = (baseDate: Date) =>
  addDays(baseDate, APPEAL_WINDOW_DAYS)
