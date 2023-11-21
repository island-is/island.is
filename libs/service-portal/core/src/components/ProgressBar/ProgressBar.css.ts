import { style } from '@vanilla-extract/css'

export const inner = style({
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
  transition: 'transform 0.5s ease-out',
  willChange: 'transform',
})

export const progress = style({
  height: '12px',
  top: 0,
})

export const vertical = style({
  width: '12px',
  height: 'auto',
})
