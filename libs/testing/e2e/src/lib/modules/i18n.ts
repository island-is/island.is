import { createIntl, createIntlCache, MessageDescriptor } from '@formatjs/intl'

const cache = createIntlCache()
const intl = createIntl(
  {
    locale: 'is', // Default locale set to Icelandic ('is')
    onError: (error) => {
      if (error?.code === 'MISSING_TRANSLATION') return
      console.warn(error)
    },
  },
  cache,
)

export const label = (message: MessageDescriptor): string =>
  intl.formatMessage(message)
