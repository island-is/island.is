import { useState, useEffect } from 'react'
import throttle from 'lodash/throttle'
import { theme } from '@island.is/island-ui/theme'
import { useEvent } from 'react-use'

const { sm, md, lg, xl } = theme.breakpoints

type Breakpoints = {
  [key in keyof typeof theme.breakpoints]: boolean
}

const getDeviceBreakpoints = (width: number): Breakpoints => ({
  xs: width < sm,
  sm: width >= sm,
  md: width >= md,
  lg: width >= lg,
  xl: width >= xl,
})

/**
 * Helper hook to get the state of breakpoints
 * @example usage of useBreakpoint
 *
 * const { xs, sm, md, lg, xl } = useBreakpoint()
 *
 * if (xs === true) {
 *  // Is xs breakpoint
 * }
 *
 * if (md === true) {
 *  // Is md breakpoint and xs is also true
 * }
 */
export const useBreakpoint = (): Breakpoints => {
  const [breakpoint, setBreakpoint] = useState(() => getDeviceBreakpoints(lg))

  useEffect(() => {
    setBreakpoint(getDeviceBreakpoints(window.innerWidth))
  }, [])

  const calcInnerWidth = throttle(
    () => setBreakpoint(getDeviceBreakpoints(window.innerWidth)),
    200,
  )

  useEvent('resize', calcInnerWidth)

  return breakpoint
}
