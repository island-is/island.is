import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const verticalLine = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      transform: 'rotate(90deg)',
      width: 80,
    },
  },
})
