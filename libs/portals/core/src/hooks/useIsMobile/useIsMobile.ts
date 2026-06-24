import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

export const useIsMobile = () => {
  const { width } = useWindowSize()

  return {
    isMobile: !!width && width < theme.breakpoints.md,
  }
}

export default useIsMobile
