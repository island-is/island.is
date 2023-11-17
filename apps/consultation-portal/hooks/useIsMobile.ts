import { useContext, useEffect, useState } from 'react'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from './useIsWindowSize'
import { IsSsrMobileContext } from '../context'

export const useIsMobile = () => {
  const isSsrMobile = useContext(IsSsrMobileContext)
  const [isClientMobile, setIsClientMobile] = useState(false)
  const { width } = useWindowSize()

  useEffect(() => {
    if (!!width && width < theme.breakpoints.md) {
      return setIsClientMobile(true)
    }
    return setIsClientMobile(false)
  }, [width])

  const isMobile = isSsrMobile || isClientMobile

  return {
    isMobile,
  }
}

export default useIsMobile
