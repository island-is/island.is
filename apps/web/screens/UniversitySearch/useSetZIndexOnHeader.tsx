import { useEffect } from 'react'

export const useSetZIndexOnHeader = () => {
  useEffect(() => {
    const headerElement = document.getElementsByTagName('header')[0]

    if (headerElement) {
      headerElement.style.zIndex = '1000'
    }

    return () => {
      if (headerElement) {
        headerElement.style.zIndex = ''
      }
    }
  }, [])
}
