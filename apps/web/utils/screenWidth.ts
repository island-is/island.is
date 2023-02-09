import { theme } from '@island.is/island-ui/theme'

export const getScreenWidthString = (width: number) => {
  if (width >= theme.breakpoints.xl) return 'xl'
  if (width >= theme.breakpoints.lg) return 'lg'
  if (width >= theme.breakpoints.md) return 'md'
  if (width >= theme.breakpoints.sm) return 'sm'
  return 'xs'
}
