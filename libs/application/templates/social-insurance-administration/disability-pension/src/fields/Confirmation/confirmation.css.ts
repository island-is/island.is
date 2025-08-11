import { style } from '@vanilla-extract/css'
import { globalStyle } from '@vanilla-extract/css'

export const markdownContent = style({})
globalStyle(`${markdownContent} li span`, {
  fontSize: 14,
})

globalStyle(`${markdownContent} li > span > div > div > span `, {
  width: 13,
})

globalStyle(`${markdownContent} li > span > div > div > span > span`, {
  backgroundColor: 'black !important',
  top: -3,
})

globalStyle(`${markdownContent} li > span > div > div > span > span::before`, {
  backgroundColor: 'black !important',
  width: 4,
  height: 4,
})
