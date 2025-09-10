import { globalStyle, style } from '@vanilla-extract/css'

export const relative = style({
  position: 'relative',
})

globalStyle(`${relative} a`, {
  textDecoration: 'none',
})

export const search = style({
  maxWidth: '550px',
})
