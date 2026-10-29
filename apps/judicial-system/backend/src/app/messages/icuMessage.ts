import type { MessageDescriptor } from '@formatjs/intl'

/** Nest formatMessage only interpolates MessageDescriptors, not plain strings. */
export const icuMessage = (message: string): MessageDescriptor => ({
  id: message,
  defaultMessage: message,
})