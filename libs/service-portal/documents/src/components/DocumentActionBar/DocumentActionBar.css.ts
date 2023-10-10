import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const filterBtns = style({})

globalStyle(`${filterBtns} button:hover`, {
  backgroundColor: theme.color.blue100,
})

globalStyle(`${filterBtns} button`, {
  backgroundColor: theme.color.white,
  width: 40,
  height: 40,
})

globalStyle(`${filterBtns} button svg`, {
  width: 20,
  height: 20,
})
