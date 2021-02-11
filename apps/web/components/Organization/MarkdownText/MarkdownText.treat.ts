import { globalStyle, style } from 'treat'

export const markdownText = style({})

globalStyle(`${markdownText} ul`, {
  paddingTop: 16,
})

globalStyle(`${markdownText} p`, {
  whiteSpace: 'pre-line',
})
