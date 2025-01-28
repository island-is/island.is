import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  paddingLeft: theme.grid.gutter.mobile * 2,
  paddingRight: theme.grid.gutter.mobile * 2,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      paddingLeft: theme.grid.gutter.desktop * 2,
      paddingRight: theme.grid.gutter.desktop * 2,
    },
  },
})
