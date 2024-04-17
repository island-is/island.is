import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const tabBar = style({
  display: 'inline-flex',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      height: 0,
      overflow: 'hidden',
      display: 'none',
    },
  },
})
