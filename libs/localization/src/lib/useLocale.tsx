import { useContext, useEffect } from 'react'
import { LocaleContext } from './LocaleContext'
import { useIntl } from 'react-intl'

export function useLocale(namespaces?: string | string[]) {
  const intl = useIntl()
  const { loadMessages, loadingMessages, lang } = useContext(LocaleContext)

  useEffect(() => {
    loadMessages(namespaces, lang)
  }, [namespaces, lang])

  return {
    ...intl,
    lang,
    loadingMessages,
  }
}

export default useLocale
