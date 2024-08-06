// // Create the `intl` object
import { createIntl, createIntlCache, MessageDescriptor } from '@formatjs/intl'
const cache = createIntlCache()
const intl = createIntl(
  {
    locale: 'is',
    onError: (err) => {
      if (err?.code == 'MISSING_TRANSLATION') return
      console.warn(err)
    },
  },
  cache,
)

export const label = (l: MessageDescriptor) => intl.formatMessage(l)
