import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  alignItems: 'flex-start',
  columnGap: theme.spacing[3],
  rowGap: theme.spacing[2],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      rowGap: theme.spacing[3],
    },
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
})
