import type { EventLocation } from '../graphql/schema'

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
