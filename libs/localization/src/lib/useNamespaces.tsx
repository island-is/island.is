import { useContext, useEffect } from 'react'
import isEmpty from 'lodash/isEmpty'

import { LocaleContext } from './LocaleContext'

export function useNamespaces(namespaces?: string | string[]) {
  const { loadMessages, loadingMessages, messages, changeLanguage } =
    useContext(LocaleContext)

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
