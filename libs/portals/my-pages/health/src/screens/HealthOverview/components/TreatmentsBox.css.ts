import { style } from '@vanilla-extract/css'

export const cardLink = style({
  display: 'block',
  textDecoration: 'none',
  selectors: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
})

export const image = style({
  maxHeight: 180,
})
