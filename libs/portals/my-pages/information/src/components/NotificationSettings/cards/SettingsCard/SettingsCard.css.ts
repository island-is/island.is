import { style } from '@vanilla-extract/css'

export const wrapper = style({
  display: 'grid',
  gridTemplateColumns: '1fr max-content',
  alignItems: 'center',
})

export const toggleButton = style({
  marginBottom: 0,
})
