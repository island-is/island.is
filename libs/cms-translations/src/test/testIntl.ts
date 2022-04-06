import {
  createIntl,
  createIntlCache,
  MessageDescriptor,
  IntlShape,
} from '@formatjs/intl'
import { parse, MessageFormatElement } from '@formatjs/icu-messageformat-parser'

import type { FormatMessage } from '../types'
import { formatMessage } from './../lib/intl.service'

const messagesToRecord = (
  messages: Record<string, MessageDescriptor>,
): Record<string, MessageFormatElement[]> => {
  return Object.keys(messages).reduce((result, key) => {
    const message = messages[key]
    if (!message.id) return result
    if (!message.defaultMessage) return result

    try {
      const value =
        typeof message.defaultMessage === 'string'
          ? parse(message.defaultMessage)
          : message.defaultMessage

      return { ...result, [message.id]: value }
    } catch (e) {
      console.error('Unable to get value for', message.id, e)
      throw e
    }
  }, {} as Record<string, MessageFormatElement[]>)
}

export const createTestIntl = (
  locale = 'is-IS',
  messages: Record<string, MessageDescriptor>,
): Omit<IntlShape<string>, 'formatMessage'> & {
  formatMessage: FormatMessage
} => {
  const cache = createIntlCache()
  const intl = createIntl(
    {
      locale,
      messages: messagesToRecord(messages),
    },
    cache,
  )

  return {
    ...intl,
    formatMessage: formatMessage(intl),
  }
}
