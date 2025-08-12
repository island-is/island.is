import { Application } from '@island.is/application/types'
import { ApplicantType } from '../shared/constants'
import sub from 'date-fns/sub'
import startOfMonth from 'date-fns/startOfMonth'
import endOfMonth from 'date-fns/endOfMonth'
import addMonths from 'date-fns/addMonths'
import addYears from 'date-fns/addYears'
import parseISO from 'date-fns/parseISO'
import { getValueViaPath } from '@island.is/application/core'

export const dateFromMinDate = (application: Application) => {
  const isStudent =
    getValueViaPath<ApplicantType>(
      application.answers,
      'studentOrTouristRadioFieldTourist',
    ) === ApplicantType.STUDENT
  // Students can apply up to one year back in time, others three months
  return isStudent
    ? sub(new Date(), { years: 1 })
    : startOfMonth(sub(new Date(), { months: 3 }))
}

export const dateToMinDate = (application: Application) => {
  const dateFrom = getValueViaPath<string>(
    application.answers,
    'period.dateFieldFrom',
  )
  return dateFrom ? new Date(dateFrom) : new Date()
}

export const dateToMaxDate = (application: Application) => {
  const dateFrom = getValueViaPath<string>(
    application.answers,
    'period.dateFieldFrom',
  )
  const isStudent =
    getValueViaPath<ApplicantType>(
      application.answers,
      'studentOrTouristRadioFieldTourist',
    ) === ApplicantType.STUDENT
  const parsed = dateFrom ? parseISO(dateFrom) : new Date()
  return isStudent
    ? endOfMonth(addYears(parsed, 1))
    : endOfMonth(addMonths(parsed, 2))
}
