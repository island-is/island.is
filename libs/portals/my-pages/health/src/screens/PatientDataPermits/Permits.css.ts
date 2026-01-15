import { globalStyle, style } from '@vanilla-extract/css'

export const toggleBox = style({})

export const toggleButton = style({
  fontSize: 16,
  marginBottom: 0,
})

globalStyle(`${toggleBox} > p`, {
  fontSize: 16,
})
