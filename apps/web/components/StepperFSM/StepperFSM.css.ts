import { style } from '@vanilla-extract/css'

export const container = style({
  minHeight: 400,
})

export const answerRowContainer = style({
  display: 'grid',
  gridTemplateColumns: '7fr 2fr 1fr',
  borderBottom: '1px solid lightgrey',
})
