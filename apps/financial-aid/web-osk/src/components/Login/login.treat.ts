import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const gridRowContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gridTemplateRows: 'max-content auto',
  height: '100%',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridTemplateColumns: 'repeat(12, 1fr)',
      gridTemplateRows: 'auto',
      columnGap: theme.spacing[3],
    },
  },
})

export const loginContainer = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridColumn: '3 / span 6',
    },
  },
})
