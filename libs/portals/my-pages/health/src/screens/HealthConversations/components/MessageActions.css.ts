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

// Hover only — keyboard focus must keep island-ui's mint circle
globalStyle(`${filterActionButtons} button:hover`, {
  backgroundColor: theme.color.blue100,
  boxShadow: 'none',
})

// White instead of blue — unread rows are tinted blueberry100, where a blue
// hover circle would disappear
export const rowActionButtons = style({})

globalStyle(`${rowActionButtons} button:hover`, {
  backgroundColor: theme.color.white,
})

export const circleActionButtons = style({})

globalStyle(`${circleActionButtons} button`, {
  width: 40,
  height: 40,
})

globalStyle(`${circleActionButtons} button svg`, {
  width: 20,
  height: 20,
})
