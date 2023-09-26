import { globalStyle, style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const filterBtns = style({})

globalStyle(`${filterBtns} button`, {
  backgroundColor: theme.color.white,
})
