/**
 * Check if a date is valid, i.e. not "Invalid Date"
 * @param date
 */
export const isValidDate = (date: Date) => {
  return date instanceof Date && !isNaN(date.getTime())
}

export const ICELAND_TIME_ZONE = 'Atlantic/Reykjavik'

const icelandTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: ICELAND_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

/**
 * Shifts a date so its local wall clock values match Icelandic time. Needed
 * because date-fns formats in the runtime time zone, which would otherwise show
 * a different time to users outside of Iceland for the same instant.
 * @param date
 */
export const toIcelandTime = (date: Date | string | number): Date => {
  const parsed = date instanceof Date ? date : new Date(date)

  if (!isValidDate(parsed)) {
    return parsed
  }

  const parts = icelandTimeFormatter.formatToParts(parsed)
  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0)

  const shifted = new Date(2000, 0, 1)
  shifted.setFullYear(getPart('year'), getPart('month') - 1, getPart('day'))
  shifted.setHours(getPart('hour'), getPart('minute'), getPart('second'), 0)

  return shifted
}
