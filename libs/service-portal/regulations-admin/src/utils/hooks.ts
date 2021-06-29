import { useEffect, useState } from 'react'

export const useIsBrowserSide = () => {
  const [isBrowser, setIsBrowser] = useState<true | undefined>(undefined)
  useEffect(() => {
    setIsBrowser(true)
  }, [])
  return isBrowser
}
