import { useContext, useEffect } from 'react'
import { LocaleContext } from './LocaleContext'
import { isEmpty } from 'lodash'

export function useNamespaces(namespaces?: string | string[]) {
  const {
    loadMessages,
    loadingMessages,
    messages,
    changeLanguage,
  } = useContext(LocaleContext)

  useEffect(() => {
    if (!isEmpty(namespaces)) {
      loadMessages(namespaces as string | string[])
    }
  }, [loadMessages, namespaces])

  return {
    loadingMessages,
    messages,
    changeLanguage,
  }
}

export default useNamespaces
