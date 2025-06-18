import { getValueViaPath } from '@island.is/application/core'
import {
  LONG_TERM_MAX_DAYS,
  LONG_TERM_MIN_DAYS,
  MS_IN_DAY,
  SHORT_TERM_MAX_DAYS,
  SHORT_TERM_MIN_DAYS,
} from '../constants'
import { checkIfExemptionTypeShortTerm } from './getExemptionType'
import { FormValue } from '@island.is/application/types'

export const getMinDateFrom = (answers: FormValue) => {
  const dateToStr = getValueViaPath<string>(answers, 'exemptionPeriod.dateTo')
  const dateTo = dateToStr ? new Date(dateToStr) : undefined

  const today = new Date()
  if (!dateTo) return today

  const offset = checkIfExemptionTypeShortTerm(answers)
    ? SHORT_TERM_MAX_DAYS
    : LONG_TERM_MAX_DAYS

  const lowerBound = new Date(dateTo.getTime() - offset * MS_IN_DAY)

  return lowerBound > today ? lowerBound : today
}

export const getMaxDateFrom = (answers: FormValue) => {
  const dateToStr = getValueViaPath<string>(answers, 'exemptionPeriod.dateTo')
  const dateTo = dateToStr ? new Date(dateToStr) : undefined

  if (!dateTo) return undefined

  const offset = checkIfExemptionTypeShortTerm(answers)
    ? SHORT_TERM_MIN_DAYS
    : LONG_TERM_MIN_DAYS

  const upperBound = new Date(dateTo.getTime() - offset * MS_IN_DAY)

  const today = new Date()
  return upperBound > today ? upperBound : today
}

export const getMinDateTo = (answers: FormValue) => {
  const dateFromStr = getValueViaPath<string>(
    answers,
    'exemptionPeriod.dateFrom',
  )
  const dateFrom = dateFromStr ? new Date(dateFromStr) : new Date()

  const offset = checkIfExemptionTypeShortTerm(answers)
    ? SHORT_TERM_MIN_DAYS
    : LONG_TERM_MIN_DAYS

  return new Date(dateFrom.getTime() + offset * MS_IN_DAY)
}

export const getMaxDateTo = (answers: FormValue) => {
  const dateFromStr = getValueViaPath<string>(
    answers,
    'exemptionPeriod.dateFrom',
  )
  const dateFrom = dateFromStr ? new Date(dateFromStr) : new Date()

  const offset = checkIfExemptionTypeShortTerm(answers)
    ? SHORT_TERM_MAX_DAYS
    : LONG_TERM_MAX_DAYS

  return new Date(dateFrom.getTime() + offset * MS_IN_DAY)
}
