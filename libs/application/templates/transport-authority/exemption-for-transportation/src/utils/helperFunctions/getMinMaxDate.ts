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

const addDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * MS_IN_DAY)

export const getMinDateFrom = (answers: FormValue) => {
  const dateToStr = getValueViaPath<string>(answers, 'exemptionPeriod.dateTo')
  const dateTo = dateToStr ? new Date(dateToStr) : undefined

  const today = new Date()
  if (!dateTo) return today

  const offset = checkIfExemptionTypeShortTerm(answers)
    ? -SHORT_TERM_MAX_DAYS
    : -LONG_TERM_MAX_DAYS

  const lowerBound = addDays(dateTo, offset)
  return lowerBound > today ? lowerBound : today
}

export const getMaxDateFrom = (answers: FormValue) => {
  const dateToStr = getValueViaPath<string>(answers, 'exemptionPeriod.dateTo')
  const dateTo = dateToStr ? new Date(dateToStr) : undefined
  if (!dateTo) return undefined

  const offset = checkIfExemptionTypeShortTerm(answers)
    ? -SHORT_TERM_MIN_DAYS
    : -LONG_TERM_MIN_DAYS

  const upperBound = addDays(dateTo, offset)
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

  return addDays(dateFrom, offset)
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

  return addDays(dateFrom, offset)
}
