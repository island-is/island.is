import { globalStyle, style } from '@vanilla-extract/css'

export const selectBox = style({})

globalStyle(`${selectBox} #rental-month-year`, {
  maxHeight: 250,
  marginTop: 20,
  marginBottom: 20,
  padding: '4px 0 0 4px',
  overflowY: 'scroll',
  overflowX: 'hidden',
})
