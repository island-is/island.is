import { style } from '@vanilla-extract/css'

export const table = style({
  overflowX: 'scroll',
})

export const fixedColumns = style({
  position: 'absolute',
  width: '5em',
})
