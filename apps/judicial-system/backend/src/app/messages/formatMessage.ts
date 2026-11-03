import {
  createIntl,
  createIntlCache,
  MessageDescriptor,
} from '@formatjs/intl'

/**
 * Formats ICU message descriptors (or returns plain strings as-is).
 * Judicial-system copy lives in code; there is no CMS catalog lookup.
 */
export type FormatMessage = (
  descriptor: MessageDescriptor | string,
  values?: Record<string, unknown>,
) => string

const cache = createIntlCache()

const intl = createIntl(
  {
    locale: 'is',
    messages: {},
    onError: () => undefined,
  },
  cache,
)

export const formatMessage: FormatMessage = (descriptor, values) => {
  if (!descriptor) {
    return ''
  }

  if (typeof descriptor === 'string') {
    return descriptor
  }

  return intl.formatMessage(descriptor, values)
}
