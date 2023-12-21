import { formatText } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { OJOIApplication } from '../lib/types'

export const useFormatMessage = (application: OJOIApplication) => {
  const { formatMessage, locale } = useLocale()

  const f = (message: { id: string; defaultMessage: string }, values = {}) => {
    return formatText(message, application as unknown as Application, () =>
      formatMessage(message, values),
    )
  }

  return { f, locale }
}
