import {
  createIntl,
  createIntlCache,
  IntlShape,
  OptionalIntlConfig,
} from '@formatjs/intl'

import type { FormatMessage } from '../types'
import { formatMessage } from './../lib/intl.service'

export const createTestIntl = (
  config: OptionalIntlConfig<string>,
): Omit<IntlShape<string>, 'formatMessage'> & {
  formatMessage: FormatMessage
} => {
  const cache = createIntlCache()
  const intl = createIntl(config, cache)

  return {
    ...intl,
    formatMessage: formatMessage(intl),
  }
}
