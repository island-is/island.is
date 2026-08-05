import { style } from '@vanilla-extract/css'

export const container = style({
  minHeight: 260,
  minWidth: 0,
  overflow: 'hidden',
})

export const image = style({
  width: 120,
  height: 'auto',
  maxWidth: 120,
  maxHeight: 120,
  objectFit: 'contain',
})
