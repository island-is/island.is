import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  minHeight: '-webkit-fill-available',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      minHeight: `calc(100vh - ${theme.headerHeight.large}px)`,
    },
  },
})

export const contentBox = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      minHeight: `calc(100vh - ${theme.headerHeight.large}px - 2 * ${theme.spacing[5]}px)`,
    },
  },
})
