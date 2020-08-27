import { style } from 'treat'

export const active = style({
  fontWeight: 600,
})

export const bullet = style({
  pointerEvents: 'none',
  position: 'absolute',
  left: -5,
  marginTop: 1,
  transition: 'top 150ms ease',
})

export const bulletRight = style({
  right: -5,
  left: 'initial',
})

export const hidden = style({
  display: 'none',
})
