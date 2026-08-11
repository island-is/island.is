import addDays from 'date-fns/addDays'
import endOfDay from 'date-fns/endOfDay'

import { ServiceRequirement } from './verdict'

export const getMillisecondsFromDays = (days: number) =>
  days * 24 * 60 * 60 * 1000

export const VERDICT_APPEAL_WINDOW_DAYS = 28
const FINE_APPEAL_WINDOW_DAYS = 3

const APPEAL_WINDOW_DAYS = 3

export const hasDatePassed = (deadline: Date) => Date.now() > deadline.getTime()

export const getIndictmentAppealDeadline = ({
  baseDate,
  isFine,
}: {
  baseDate: Date
  isFine?: boolean
}) => {
  const windowDays = isFine
    ? FINE_APPEAL_WINDOW_DAYS
    : VERDICT_APPEAL_WINDOW_DAYS
  // The appeal window runs until midnight at the end of the last day, so expiry
  // has to be measured against the same instant we display. Measuring against
  // the raw base date instead expires the deadline at whatever time of day the
  // verdict was served - and since service dates are entered date-only, that
  // used to swallow the whole last day of the window.
  const deadlineDate = endOfDay(addDays(baseDate, windowDays))

  return {
    deadlineDate,
    isDeadlineExpired: hasDatePassed(deadlineDate),
  }
}

export const getAppealDeadlineDate = (baseDate: Date) =>
  addDays(baseDate, APPEAL_WINDOW_DAYS)

export const hasTimestamp = (date: Date): boolean => {
  return (
    date.getTime() !==
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  )
}

export const getDefendantServiceDate = ({
  verdict,
  fallbackDate,
}: {
  verdict:
    | {
        serviceDate?: Date | string
        serviceRequirement?: ServiceRequirement
      }
    | undefined
  fallbackDate?: Date | string
}) => {
  const isServiceRequired =
    verdict?.serviceRequirement === ServiceRequirement.REQUIRED
  const baseDate = isServiceRequired ? verdict.serviceDate : fallbackDate
  return baseDate ? new Date(baseDate) : undefined
}
