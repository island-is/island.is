import { style } from '@vanilla-extract/css'

export const container = style({
  minHeight: 260,
  minWidth: 0,
  overflow: 'hidden',
})

export const image = style({
  width: '100%',
  height: 'auto',
  maxHeight: '100%',
  objectFit: 'contain',
})
