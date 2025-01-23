import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const indent = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      marginLeft: '130px',
    },
  },
})
