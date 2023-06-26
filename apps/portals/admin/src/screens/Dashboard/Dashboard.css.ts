import { globalStyle, style } from '@vanilla-extract/css'

export const relative = style({
  position: 'relative',
})

globalStyle(`${relative} a`, {
  textDecoration: 'none',
})

export const img = style({
  width: '100%',
  maxWidth: 110,
})
