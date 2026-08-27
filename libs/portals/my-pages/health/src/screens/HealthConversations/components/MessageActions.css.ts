import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const filterActionButtons = style({
  display: 'flex',
  gap: '8px',
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

export const circleActionButtons = style({})

globalStyle(`${circleActionButtons} button`, {
  width: 40,
  height: 40,
})

globalStyle(
  `${circleActionButtons} button:hover, ${circleActionButtons} button:focus-visible`,
  {
    backgroundColor: theme.color.white,
  },
)

globalStyle(`${circleActionButtons} button svg`, {
  width: 20,
  height: 20,
})
