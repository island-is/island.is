import { m } from '../lib/messages'
import { useLocale } from '@island.is/localization'

export const useErrorFormatMessage = () => {
  const { formatMessage } = useLocale()

  const formatErrorMessage = (messageKey?: string) => {
    const message = m[messageKey as keyof typeof m]

    return message ? formatMessage(message) : undefined
  }

  return { formatErrorMessage }
}
