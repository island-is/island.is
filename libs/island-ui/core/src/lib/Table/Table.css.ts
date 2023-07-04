import { style } from '@vanilla-extract/css'

export const table = style({
  borderCollapse: 'collapse',
})

export const cell = style({
  verticalAlign: 'middle',
})

export const stickyHead = style({
  position: 'sticky',
  top: 0,
})
