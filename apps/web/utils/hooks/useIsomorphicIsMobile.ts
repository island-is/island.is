import { useState } from 'react'
import { useIsomorphicLayoutEffect, useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

export const useIsomorphicIsMobile = () => {
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState(false)

  useIsomorphicLayoutEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  return isMobile
}
