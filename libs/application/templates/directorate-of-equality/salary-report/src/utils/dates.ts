import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import startOfDay from 'date-fns/startOfDay'
import { REMEDY_DATE_MAX_YEARS_AHEAD } from './constants'

const DATE_INPUT_FORMAT_LENGTH = 'yyyy-MM-dd'.length

// DatePickerController both reads and writes `yyyy-MM-dd`, but a date-only
// value coming back from DMR has been through the generated client's response
// transformer (`new Date(...)`) and then externalData's JSON round-trip, so it
// arrives as a full ISO instant instead. Both forms start with the same ten
// characters — sliced rather than parsed on purpose: `parseISO` on the instant
// resolves it in the browser's zone, which lands a day either side of the
// stored date west or east of UTC.
export const toDateInputValue = (value?: string | Date | null): string => {
  if (!value) return ''
  const iso = value instanceof Date ? value.toISOString() : value
  return iso.slice(0, DATE_INPUT_FORMAT_LENGTH)
}

// `format` throws on an unparseable value, so a date the backend stored in some
// other shape is shown as-is rather than taking the screen down with it.
export const formatDateValue = (value?: string | null): string => {
  if (!value) return ''
  try {
    return format(parseISO(value), 'd.M.yyyy')
  } catch {
    return value
  }
}

// The window DMR accepts for "Dagsetning úrbóta". Both ends are local midnight,
// which is where `parseISO` puts a `yyyy-MM-dd` answer too, so the comparison in
// isRemedyDateInWindow comes out right rather than an hours-off boundary.
//
// `min` is tomorrow, not today: the API's own contract says the date must be in
// the future (clientConfig's `remedyDate` description), and a deadline for
// completing improvements is not a thing to set for the same day. `max` is
// measured from today regardless, so shifting `min` doesn't shorten the window.
export const remedyDateBounds = (now: Date): { min: Date; max: Date } => {
  const midnight = startOfDay(now)
  return {
    min: addDays(midnight, 1),
    max: new Date(
      midnight.getFullYear() + REMEDY_DATE_MAX_YEARS_AHEAD,
      midnight.getMonth(),
      midnight.getDate(),
    ),
  }
}

// The calendar's own min/max only constrain what it OFFERS. A date that was in
// range when it was picked goes stale while the draft sits — POSTPONED prunes
// after 90 days — so the stored answer has to be re-checked against today, or a
// plan that looks complete submits and comes back as a bare 400 from DMR.
export const isRemedyDateInWindow = (
  value: string | undefined | null,
  now: Date,
): boolean => {
  if (!value) return false
  const picked = parseISO(value)
  if (Number.isNaN(picked.getTime())) return false
  const { min, max } = remedyDateBounds(now)
  return picked >= min && picked <= max
}
