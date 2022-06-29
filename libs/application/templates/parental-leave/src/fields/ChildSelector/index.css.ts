import { style } from '@vanilla-extract/css'

export const flexShrink = style({
  flex: 0,
  '@media': {
    [`screen and (min-width: 1200px)`]: {
      flex: 'none',
    },
  },
})
