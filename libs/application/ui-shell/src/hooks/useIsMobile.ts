import { useContext, useEffect, useState } from 'react'
import { theme } from '@island.is/island-ui/theme'

import { useWindowSize } from './useIsWindowSize'

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()

  useEffect(() => {
    if (!!width && width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    return setIsMobile(false)
  }, [width])

  return {
    isMobile,
  }
}

export default useIsMobile
