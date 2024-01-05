import { style } from '@vanilla-extract/css'

export const leftColumn = style({
  flex: 1,
  zIndex: 2,
})

export const rightColumn = style({
  flex: 1,
  overflowY: 'scroll',
  overflowX: 'hidden',
})
