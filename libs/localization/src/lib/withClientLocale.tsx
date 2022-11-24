import { useContext, useEffect } from 'react'
import { LocaleContext } from './LocaleContext'

export const withClientLocale = (namespaces: string | string[] = 'global') => (
  Component: React.ElementType,
) => {
  // For non Nextjs apps
  const NewComponent = (props: Record<string, any>) => {
    const { loadMessages, loadingMessages, loadedNamespaces } = useContext(
      LocaleContext,
    )

    useEffect(() => {
      loadMessages(namespaces)
    }, [])

    const loadingNamespaces =
      typeof namespaces === 'string' ? [namespaces] : namespaces
    const hasAllNamespaces = loadingNamespaces.every((el) => {
      return loadedNamespaces.includes(el)
    })

    if (loadingMessages || !hasAllNamespaces) return null

    return <Component {...props} />
  }

  return NewComponent
}

export default withClientLocale
