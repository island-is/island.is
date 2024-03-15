import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const filterActionButtons = style({
  display: 'flex',
  gap: '2px',
})

globalStyle(`${filterActionButtons} button:hover`, {
  backgroundColor: theme.color.white,
})
