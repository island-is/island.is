import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const filterBtns = style({})

globalStyle(`${filterBtns} button:hover, ${filterBtns} a > span:hover`, {
  backgroundColor: theme.color.blue100,
})

globalStyle(`${filterBtns} a:focus`, {
  outline: 0,
})

globalStyle(`${filterBtns} a:focus > span`, {
  color: '#00003c',
  backgroundColor: '#00e4ca',
})

globalStyle(`${filterBtns} button, ${filterBtns} a > span`, {
  backgroundColor: theme.color.white,
  width: 40,
  height: 40,
})

globalStyle(`${filterBtns} button svg, ${filterBtns} a > span svg`, {
  width: 20,
  height: 20,
})
