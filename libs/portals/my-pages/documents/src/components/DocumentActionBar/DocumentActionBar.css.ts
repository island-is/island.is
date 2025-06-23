import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const filterBtns = style({
  marginRight: theme.spacing[1],
})

export const actionsButton = style({
  ':hover': {
    textDecoration: 'none',
    boxShadow: 'none',
    border: 'none',
  },
})

globalStyle(`${filterBtns} button:hover, ${filterBtns} a > span:hover`, {
  backgroundColor: theme.color.blue100,
})

globalStyle(`${filterBtns} a:focus`, {
  outline: 0,
})

globalStyle(`${filterBtns} a:focus > span`, {
  color: '#00003c',
  backgroundColor: '#00e4ca',
})

globalStyle(`${filterBtns} button, ${filterBtns} a > span`, {
  backgroundColor: theme.color.white,
  width: 40,
  height: 40,
})

globalStyle(`${filterBtns} button svg, ${filterBtns} a > span svg`, {
  width: 20,
  height: 20,
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
