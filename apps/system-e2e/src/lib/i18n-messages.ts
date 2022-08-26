//
// // Create the `intl` object
import { createIntl, createIntlCache, MessageDescriptor } from '@formatjs/intl'
import { cypressError } from '../support/utils'
const cache = createIntlCache()
const intl = createIntl(
  {
    locale: 'is',
    onError: (err) => {
      cypressError(err.toString())
    },
  },
  cache,
)

export const label = (l: MessageDescriptor) => intl.formatMessage(l)
