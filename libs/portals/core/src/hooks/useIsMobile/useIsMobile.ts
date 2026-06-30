import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

export const useIsMobile = () => {
  const { width } = useWindowSize()
  const isMobile = width != null && width < theme.breakpoints.md

  return {
    isMobile,
  }
}

export default useIsMobile
