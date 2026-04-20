import { style } from '@vanilla-extract/css'

export const clickable = style({
  cursor: 'pointer',
})

export const capitalizeText = style({
  textTransform: 'capitalize',
})

export const linkStyle = style({
  cursor: 'pointer',
  textDecoration: 'underline',
})
