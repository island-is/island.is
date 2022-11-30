import { useContext, useEffect } from 'react'
import isEmpty from 'lodash/isEmpty'

import { LocaleContext } from './LocaleContext'

export function useNamespaces(namespaces?: string | string[]) {
  const {
    loadMessages,
    loadingMessages,
    messages,
    changeLanguage,
    loadedNamespaces,
  } = useContext(LocaleContext)

  const loadingNamespaces =
    typeof namespaces === 'string' ? [namespaces] : namespaces

  const hasAllNamespaces = (loadingNamespaces || []).every((el) => {
    return loadedNamespaces.includes(el)
  })

  useEffect(() => {
    if (namespaces && !isEmpty(namespaces)) {
      loadMessages(namespaces)
    }
  }, [loadMessages, namespaces])

  return {
    loadingMessages: loadingMessages || !hasAllNamespaces,
    messages,
    changeLanguage,
  }
}

export default useNamespaces
