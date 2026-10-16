import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import addDays from 'date-fns/addDays'
import parseISO from 'date-fns/parseISO'

export const oneDayInMs = 24 * 60 * 60 * 1000
export const minDate = new Date(Date.now() - 3 * oneDayInMs) // Three days ago
export const maxDate = new Date(Date.now() + 3 * oneDayInMs) // Three days from now

export const dateRangeFromMinDate = (application: Application) => {
  const dateFrom = getValueViaPath<string>(application.answers, 'dateRangeFrom')
  return dateFrom && dateFrom !== '' ? new Date(dateFrom) : new Date()
}

export const dateRangeToMaxDate = (application: Application) => {
  const dateFrom = getValueViaPath<string>(application.answers, 'dateRangeFrom')

  const date = dateFrom && dateFrom !== '' ? parseISO(dateFrom) : new Date()

  return addDays(date, 7)
}
