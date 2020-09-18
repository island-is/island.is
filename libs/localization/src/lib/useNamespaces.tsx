import { useContext, useEffect } from 'react'
import { LocaleContext } from './LocaleContext'
import { isEmpty } from 'lodash'

export function useNamespaces(namespaces?: string | string[]) {
  const { loadMessages, loadingMessages, messages } = useContext(LocaleContext)

  useEffect(() => {
    if (!isEmpty(namespaces)) {
      loadMessages(namespaces)
    }
  }, [])

  return {
    loadingMessages,
    messages,
  }
}

export default useNamespaces
