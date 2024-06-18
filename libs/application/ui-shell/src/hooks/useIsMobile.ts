import { useContext, useEffect, useState } from 'react'
import { theme } from '@island.is/island-ui/theme'

import { useWindowSize } from './useIsWindowSize'

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()

  useEffect(() => {
    setIsMobile(!!width && width < theme.breakpoints.md)
  }, [width])

  return {
    isMobile,
  }
}

export default useIsMobile
