import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const link = style({})

globalStyle(`${link}:focus > span`, {
  color: theme.color.dark400,
  backgroundColor: theme.color.mint400,
})

globalStyle(`${link}:focus`, {
  outline: 0,
  boxShadow: 'none',
})
