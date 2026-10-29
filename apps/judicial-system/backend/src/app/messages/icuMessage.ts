import type { MessageDescriptor } from '@formatjs/intl'

/** Dump-backed ICU template for formatMessage (plain strings skip interpolation). */
export const icuMessage = (message: string): MessageDescriptor => ({
  id: message,
  defaultMessage: message,
})
