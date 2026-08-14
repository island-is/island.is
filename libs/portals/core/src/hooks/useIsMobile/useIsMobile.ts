import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

export const useIsMobile = (
  breakpoint: keyof typeof theme.breakpoints = 'md',
) => {
  const { width } = useWindowSize()
  const isMobile = width != null && width < theme.breakpoints[breakpoint]

  return {
    isMobile,
  }
}

/**
 * True below the `sm` breakpoint — for UI that only applies at true phone
 * widths, as opposed to the default `md` cutoff of `useIsMobile`.
 */
export const useIsPhoneWidth = () => {
  const { isMobile } = useIsMobile('sm')
  return { isPhoneWidth: isMobile }
}

export default useIsMobile
