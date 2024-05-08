import { formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'

export const GetFormattedText = (application: any, messageId: any) => {
  const { formatMessage } = useLocale()
  const message = formatMessage(messageId)
  return message
}
