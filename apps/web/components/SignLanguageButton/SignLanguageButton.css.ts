import { style } from '@vanilla-extract/css'

export const leftColumn = style({
  flex: 1,
})

export const rightColumn = style({
  flex: 1,
  overflowY: 'scroll',
})
