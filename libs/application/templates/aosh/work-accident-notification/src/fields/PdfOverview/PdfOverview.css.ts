import { style } from '@vanilla-extract/css'

export const linkWithoutDecorations = style({
  ':hover': {
    textDecoration: 'none',
  },
})
