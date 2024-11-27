import { useIntl } from 'react-intl'
import { TranslatedMessage } from '../messages'

/**
 * Helper hook to simplify translations in the app.
 */
export const useTranslate = () => {
  const intl = useIntl()

  return (key: TranslatedMessage) =>
    intl.formatMessage({
      id: key,
    })
}
