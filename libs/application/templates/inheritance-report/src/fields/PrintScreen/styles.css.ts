import { style } from '@vanilla-extract/css'

export const printButton = style({
  '@media': {
    [`screen and (min-width: 932px)`]: {
      top: 106,
      left: 140,
      zIndex: 10,
    },
  },
})
