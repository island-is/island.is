import { Application } from '@island.is/application/types'

import { formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { OJOIApplication } from '../lib/types'

export const useFormatMessage = (application: OJOIApplication) => {
  const { formatMessage, locale } = useLocale()

  const f = (message: { id: string; defaultMessage: string }) =>
    formatText(message, application as unknown as Application, formatMessage)

  return { f, locale }
}
