import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

// Date answers are stored as the calendar day, 'yyyy-MM-dd'. Both helpers work
// in local time, so the day the user picks is the day that is stored and shown.

export const DATE_ANSWER_FORMAT = 'yyyy-MM-dd'

// The picked date as a date answer, or undefined if it isn't a valid date.
export const toDateAnswer = (date: Date | null | undefined) =>
  date instanceof Date && !isNaN(date.getTime())
    ? format(date, DATE_ANSWER_FORMAT)
    : undefined

// A stored date or date limit as a local Date, or undefined if there is none
// or it can't be read.
export const parseDateAnswer = (value: unknown) => {
  if (typeof value !== 'string' || value === '') return undefined
  const date = parseISO(value)
  return isNaN(date.getTime()) ? undefined : date
}
