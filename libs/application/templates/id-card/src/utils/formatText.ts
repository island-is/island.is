import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'

export const GetFormattedText = (messageId: MessageDescriptor) => {
  const { formatMessage } = useLocale()
  const message = formatMessage(messageId)
  return `${message}`
}
