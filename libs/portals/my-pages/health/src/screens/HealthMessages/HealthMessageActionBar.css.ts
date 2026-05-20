import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const filterBtns = style({})

export const actionsButton = style({
  ':hover': {
    textDecoration: 'none',
    boxShadow: 'none',
    border: 'none',
  },
})

globalStyle(`${filterBtns} button:hover`, {
  backgroundColor: theme.color.blue100,
})

globalStyle(`${filterBtns} button`, {
  backgroundColor: theme.color.white,
})

globalStyle(`${filterBtns} button svg`, {
  width: 16,
  height: 16,
})

globalStyle(`${actionsButton} span`, {
  padding: '10px 11px',
  textDecoration: 'none',
  boxShadow: 'none',
  border: 'none',
})

globalStyle(`${actionsButton} span:hover`, {
  background: theme.color.blue100,
  borderRadius: theme.border.radius.full,
  textDecoration: 'none',
  boxShadow: 'none',
  border: 'none',
})

globalStyle(`${actionsButton} span:focus`, {
  background: theme.color.mint400,
  borderRadius: theme.border.radius.full,
})

globalStyle(`${actionsButton} span:active`, {
  background: theme.color.mint400,
  borderRadius: theme.border.radius.full,
})
