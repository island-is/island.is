import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

const mobileMediaQuery = `screen and (max-width: ${theme.breakpoints.md - 1}px)`

export const heading = style({
  fontSize: 32,
  paddingTop: 16,
})

export const description = style({
  fontSize: 18,
  maxWidth: 774,
})

export const listContainer = style({
  '@media': {
    [mobileMediaQuery]: {
      paddingLeft: 24,
      paddingRight: 24,
    },
  },
})
