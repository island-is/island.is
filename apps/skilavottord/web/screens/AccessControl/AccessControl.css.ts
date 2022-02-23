import { style } from '@vanilla-extract/css'

export const deleteMenuItem = style({
  selectors: {
    '&:hover': {
      opacity: 0.7,
    },
  },
})
