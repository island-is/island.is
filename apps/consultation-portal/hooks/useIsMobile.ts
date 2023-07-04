import { theme } from '@island.is/island-ui/theme'
import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    return setIsMobile(false)
  }, [width])

  return {
    isMobile,
  }
}

export default useIsMobile
