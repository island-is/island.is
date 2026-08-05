import { style } from '@vanilla-extract/css'

export const card = style({
  minHeight: 108,
})

export const tag = style({
  pointerEvents: 'none',
})

export const logo = style({
  width: 40,
  height: 40,
  objectFit: 'contain',
  flexShrink: 0,
})
