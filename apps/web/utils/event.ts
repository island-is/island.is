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
