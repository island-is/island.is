import { useEffect, useState } from 'react'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

export const useIsMobile = () => {
  const [isClientMobile, setIsClientMobile] = useState(false)
  const { width } = useWindowSize()

  useEffect(() => {
    if (!!width && width < theme.breakpoints.md) {
      return setIsClientMobile(true)
    }
    return setIsClientMobile(false)
  }, [width])

  const isMobile = isClientMobile

  return {
    isMobile,
  }
}

export default useIsMobile
