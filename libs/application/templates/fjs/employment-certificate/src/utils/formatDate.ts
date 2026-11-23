/**
 * Formats an ISO date or date-time (e.g. `2025-06-20` or
 * `2025-06-20T12:00:00Z`) as `20.06.2025`. Only the date part is used, so the
 * result doesn't shift with the time zone. Returns the input if it isn't a date.
 */
export const formatDate = (value?: string | Date | null): string => {
  if (!value) {
    return ''
  }
  const iso = value instanceof Date ? value.toISOString() : value
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!match) {
    return String(value)
  }
  const [, year, month, day] = match
  return `${day}.${month}.${year}`
}
