import { globalStyle, style } from '@vanilla-extract/css'

export const relative = style({
  position: 'relative',
})

globalStyle(`${relative} a`, {
  textDecoration: 'none',
})

export const subLink = style({
  width: 'fit-content',
})
