import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

// currently its not possible to add custom button to the header
// so I am using position absolute and some constants
const SMALL_SCREEN_TOP = -108
const XSMALL_SCREEN_TOP = -132
const MEDIUM_SCREEN_TOP = -146

export const printButton = style({
  top: XSMALL_SCREEN_TOP,
  right: 12,
  '@media': {
    // subtitle breaks into 2 lines
    [`screen and (min-width: 500px)`]: {
      top: SMALL_SCREEN_TOP,
    },
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      top: MEDIUM_SCREEN_TOP,
    },
    // subtitle breaks into 2 lines
    [`screen and (min-width: 932px)`]: {
      top: -theme.spacing[15],
    },
  },
})
