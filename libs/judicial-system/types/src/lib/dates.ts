import addDays from 'date-fns/addDays'
import endOfDay from 'date-fns/endOfDay'

import { ServiceRequirement } from './verdict'

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
  const deadlineDate = addDays(baseDate, windowDays)

  return {
    deadlineDate: endOfDay(deadlineDate),
    isDeadlineExpired: !!deadlineDate && hasDatePassed(deadlineDate),
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
