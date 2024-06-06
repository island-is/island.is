import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const filterActionButtons = style({
  gap: '8px',
})

globalStyle(`${filterActionButtons} button:hover`, {
  backgroundColor: theme.color.white,
})
