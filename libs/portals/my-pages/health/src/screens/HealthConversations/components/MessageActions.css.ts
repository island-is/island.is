import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const filterActionButtons = style({
  display: 'flex',
  gap: '8px',
})

export const circleActionButtons = style({})

globalStyle(`${circleActionButtons} button`, {
  backgroundColor: theme.color.white,
  width: 40,
  height: 40,
})

globalStyle(`${circleActionButtons} button:hover`, {
  backgroundColor: theme.color.blue100,
})

globalStyle(`${circleActionButtons} button svg`, {
  width: 20,
  height: 20,
})
