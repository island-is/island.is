import { style } from '@vanilla-extract/css'

export const errorMessage = style({
  gridRow: '3',
  gridColumn: 'span 10',
})

export const titleContainer = style({
  gridRow: '1',
  gridColumn: 'span 10',
  marginBottom: 24,
})

export const subTitleContainer = style({
  gridRow: '2',
  gridColumn: 'span 10',
  maxWidth: 550,
})
