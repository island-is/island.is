import { style } from '@vanilla-extract/css'

export const container = style({
  height: 120,
  minWidth: 0,
  minHeight: 0,
})

export const icon = style({
  objectFit: 'cover',
  width: '100%',
  height: 'auto',
  maxWidth: 60,
  maxHeight: 80,
})
