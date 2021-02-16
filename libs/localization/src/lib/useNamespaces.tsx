import { useContext, useEffect } from 'react'
import { LocaleContext } from './LocaleContext'
import isEmpty from 'lodash/isEmpty'

export function useNamespaces(namespaces?: string | (string | null)[]) {
  const {
    loadMessages,
    loadingMessages,
    messages,
    changeLanguage,
  } = useContext(LocaleContext)

  useEffect(() => {
    if (namespaces && !isEmpty(namespaces)) {
      loadMessages(namespaces)
    }
  }, [loadMessages, namespaces])

  return {
    loadingMessages,
    messages,
    changeLanguage,
  }
}

export default useNamespaces
