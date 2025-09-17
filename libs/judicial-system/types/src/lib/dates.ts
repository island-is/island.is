import addDays from 'date-fns/addDays'
import endOfDay from 'date-fns/endOfDay'

const VERDICT_APPEAL_WINDOW_DAYS = 28
const FINE_APPEAL_WINDOW_DAYS = 3

const APPEAL_WINDOW_DAYS = 3

export const hasDatePassed = (deadline: Date) => Date.now() > deadline.getTime()

export const getIndictmentAppealDeadlineDate = (
  baseDate: Date,
  isFine?: boolean,
) => {
  const windowDays = isFine
    ? FINE_APPEAL_WINDOW_DAYS
    : VERDICT_APPEAL_WINDOW_DAYS
  const deadlineDate = addDays(baseDate, windowDays)

  return endOfDay(deadlineDate)
}

export const getAppealDeadlineDate = (baseDate: Date) =>
  addDays(baseDate, APPEAL_WINDOW_DAYS)

export const hasTimestamp = (date: Date): boolean => {
  return (
    date.getTime() !==
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  )
}
