import { theme } from '../theme/'
type Breakpoint = keyof typeof theme['breakpoint']

const breakpoints = Object.keys(theme.breakpoints)

export interface ResponsiveRangeProps {
  above?: Exclude<Breakpoint, 'xl'>
  below?: Exclude<Breakpoint, 'xs'>
}

export const resolveResponsiveRangeProps = (
  props: ResponsiveRangeProps,
): [boolean, boolean, boolean, boolean, boolean] => {
  const { above, below } = props

  if (!above && !below) {
    return [false, false, false, false, false]
  }

  const startIndex = above ? breakpoints.indexOf(above) + 1 : 0
  const endIndex = below
    ? breakpoints.indexOf(below) - 1
    : breakpoints.length - 1
  const range = breakpoints.slice(startIndex, endIndex + 1)

  const includeXs = range.indexOf('xs') >= 0
  const includeSm = range.indexOf('sm') >= 0
  const includeMd = range.indexOf('md') >= 0
  const includeLg = range.indexOf('lg') >= 0
  const includeXl = range.indexOf('xl') >= 0

  return [includeXs, includeSm, includeMd, includeLg, includeXl]
}
