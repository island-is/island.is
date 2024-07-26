import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const summaryBlockChild = style({
  minWidth: '50%',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      minWidth: '83%',
    },
  },
})
