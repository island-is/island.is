import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      paddingLeft: theme.grid.gutter.desktop * 2,
      paddingRight: theme.grid.gutter.desktop * 2,
    },
  },
})
