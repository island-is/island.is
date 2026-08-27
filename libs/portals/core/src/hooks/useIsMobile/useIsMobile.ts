import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

export const useIsMobile = () => {
  const { width } = useWindowSize()
  const isMobile = width != null && width < theme.breakpoints.md

  return {
    isMobile,
  }
}

/**
 * True below the `sm` breakpoint — for UI that only applies at true phone
 * widths, as opposed to the default `md` cutoff of `useIsMobile`.
 */
export const useIsPhoneWidth = () => {
  const { width } = useWindowSize()
  const isPhoneWidth = width != null && width < theme.breakpoints.sm

  return { isPhoneWidth }
}

export default useIsMobile
