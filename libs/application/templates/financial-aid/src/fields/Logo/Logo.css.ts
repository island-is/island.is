import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const logo = style({
  position: 'relative',
  left: '16px',
  width: '180px',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      width: '250px',
      left: '46px',
    },
  },
})
