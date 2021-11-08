import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const taxReturn = style({
  color: theme.color.red400,
  fontWeight: 'bold',
})

export const userInfoContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  alignItems: 'flex-start',
  columnGap: theme.spacing[3],
  rowGap: theme.spacing[3],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridTemplateColumns: 'repeat(7, 1fr)',
    },
  },
})
