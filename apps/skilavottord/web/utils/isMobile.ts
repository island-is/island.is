import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

export const isMobile = () => {
  const { width } = useWindowSize()
  return width < theme.breakpoints.md
}
