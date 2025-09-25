import format from 'date-fns/format'
import isSameDay from 'date-fns/isSameDay'
import localeEN from 'date-fns/locale/en-GB'
import localeIS from 'date-fns/locale/is'

import type { Locale } from '@island.is/shared/types'

import type { EventLocation, EventTime } from '../graphql/schema'

export const formatEventLocation = (eventLocation: EventLocation) => {
  if (eventLocation.useFreeText) return eventLocation.freeText ?? ''

  const words = []

  if (eventLocation.streetAddress) {
    words.push(eventLocation.streetAddress)
    if (eventLocation.floor) {
      words.push(eventLocation.floor)
    }
  }

  if (eventLocation.postalCode) {
    words.push(eventLocation.postalCode)
  }

  return words.join(', ')
}

export const formatEventTime = (eventTime: EventTime, separator = '-') => {
  if (!eventTime.startTime) return ''
  return `${eventTime.startTime}${
    eventTime.endTime ? ` ${separator} ${eventTime.endTime}` : ''
  }`
}

export const formatEventDates = (dateFrom: string, dateTo: string, locale?: Locale) => {
  const from = new Date(dateFrom)
  const to = new Date(dateTo)

  // same date
  if (isSameDay(from,to)) {
    return format(new Date(dateFrom), 'dd MMM yyyy', {locale: locale === 'en' ? localeEN : localeIS})
  }
  const formattedDateFrom = format(from, from.getFullYear() === to.getFullYear() ? 'dd MMM' : 'dd MMM yyyy', {locale: locale === 'en' ? localeEN : localeIS})
  const formattedDateTo = format(to, 'dd MMM yyyy', {locale: locale === 'en' ? localeEN : localeIS})
  return `${formattedDateFrom} - ${formattedDateTo}`
}
