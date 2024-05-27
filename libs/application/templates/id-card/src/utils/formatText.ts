import { useLocale } from '@island.is/localization'

export const GetFormattedText = (messageId: any) => {
  const { formatMessage } = useLocale()
  const message = formatMessage(messageId)
  return `${message}`
}
