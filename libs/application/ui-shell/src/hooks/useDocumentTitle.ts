import { useEffect, useRef } from 'react'

export const useDocumentTitle = (
  title: string,
  retainOnUnmount = false,
): void => {
  const defaultTitle = useRef(document.title)

  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(() => {
    return () => {
      if (!retainOnUnmount) {
        // eslint-disable-next-line
        document.title = defaultTitle.current
      }
    }
    // eslint-disable-next-line
  }, [])
}
