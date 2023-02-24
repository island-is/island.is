import { style } from '@vanilla-extract/css'

// currently its not possible to add custom button to the header
// so I am using position absolute and some constants
const DEFAULT_TOP = 0
const SMALL_SCREEN_TOP = -20

export const printButton = style({
  position: 'absolute',
  top: DEFAULT_TOP,
  right: 12,
  '@media': {
    // subtitle breaks into 2 lines
    [`screen and (max-width: 500px)`]: {
      position: 'relative',
      top: SMALL_SCREEN_TOP,
      right: 0,
    },
  },
})
