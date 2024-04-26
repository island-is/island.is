import { style } from '@vanilla-extract/css'

export const inner = style({
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
  transition: 'transform 0.2s linear',
  willChange: 'transform',
})

export const progress = style({
  height: '12px',
})

export const vertical = style({
  width: '12px',
  height: 'auto',
})
