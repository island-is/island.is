import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const logo = style({
  width: '50%',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      width: '33%',
    },
  },
})
