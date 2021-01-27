import { MessageDict } from '@island.is/shared/types'

import { DEFAULT_LOCALE } from './translationsFromContentful'

export const translationsFromLocal = (messages: MessageDict) =>
  Object.keys(messages).map((item) => ({
    id: item,
    defaultMessage: messages[item].defaultMessage,
    description: messages[item].description,
    [DEFAULT_LOCALE]: messages[item].defaultMessage,
  }))
