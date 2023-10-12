import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

const useIsMobile = () => {
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (width < theme.breakpoints.lg) {
      return setIsMobile(true)
    }
    return setIsMobile(false)
  }, [width])

  return isMobile
}

export default useIsMobile
