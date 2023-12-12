import { Application } from '@island.is/application/types'

import { formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'

export const useFormatMessage = (application: Application) => {
  const { formatMessage } = useLocale()

  const f = (message: { id: string; defaultMessage: string }) =>
    formatText(message, application, formatMessage)

  return { f }
}
