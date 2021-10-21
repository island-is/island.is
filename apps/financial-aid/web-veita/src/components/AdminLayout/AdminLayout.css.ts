import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const gridWrapper = style({
  paddingLeft: theme.spacing[3],
  paddingRight: theme.spacing[3],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      columnGap: theme.spacing[3],
      paddingLeft: theme.spacing[6],
      paddingRight: theme.spacing[6],
    },
  },
})

export const childContainer = style({
  overflow: 'hidden',
  gridColumn: '4/-1',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridColumn: '5/-1',
    },
  },
})

export const mobileMenuOpen = style({
  transition: 'opacity 250ms ease',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      opacity: 0.5,
    },
  },
})
