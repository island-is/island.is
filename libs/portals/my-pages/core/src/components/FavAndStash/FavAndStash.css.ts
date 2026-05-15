import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const filterActionButtons = style({
  display: 'flex',
  gap: '2px',
})

globalStyle(`${filterActionButtons} button`, {
  backgroundColor: 'transparent',
  boxShadow: 'none',
})

globalStyle(
  `${filterActionButtons} button:hover, ${filterActionButtons} button:focus-visible`,
  {
    backgroundColor: theme.color.blue100,
    boxShadow: 'none',
  },
)

export const hoverWhite = style({})
globalStyle(`${hoverWhite} button:hover, ${hoverWhite} button:focus-visible`, {
  backgroundColor: theme.color.white,
})
