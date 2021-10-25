import { globalStyle, style } from '@vanilla-extract/css'

export const markdownText = style({})

globalStyle(`${markdownText} ul`, {
  paddingTop: 16,
})
