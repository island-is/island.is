import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  columnGap: theme.spacing[2],
})

export const selectContainer = style({
  minWidth: 215,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      minWidth: 320,
    },
  },
})
