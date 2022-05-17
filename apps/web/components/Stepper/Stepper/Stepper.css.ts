import { style } from '@vanilla-extract/css'

export const container = style({
  minHeight: 400,
})

export const answerRowContainer = style({
  display: 'grid',
  gridTemplateColumns: '5.3fr 3.7fr 1fr',
  borderBottom: '1px solid lightgrey',
})
