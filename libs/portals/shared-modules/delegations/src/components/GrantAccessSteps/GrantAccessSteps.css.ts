import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const input = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      minWidth: 250,
    },
  },
})
