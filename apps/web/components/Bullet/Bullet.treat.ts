import { style } from 'treat'

export const bullet = style({
  pointerEvents: 'none',
  transition: 'top 150ms ease',
})

export const bulletLeft = style({
  position: 'absolute',
  left: -5,
})

export const bulletRight = style({
  position: 'absolute',
  right: -5,
})
