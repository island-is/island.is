import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const card = style({
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  cursor: 'pointer',
  borderWidth: 1,
  boxSizing: 'border-box',
  borderStyle: 'solid',
  opacity: 0,
  borderColor: theme.color.red200,
  borderRadius: theme.border.radius.large,
  textDecoration: 'none',
  position: 'relative',
  transition: 'opacity 300ms ease, border-color 150ms ease',
  ':hover': {
    borderColor: theme.color.red400,
    textDecoration: 'none',
  },
  ':focus': {
    outline: 0,
  },
  ':before': {
    content: "''",
    display: 'inline-block',
    position: 'absolute',
    pointerEvents: 'none',
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: theme.color.transparent,
    borderRadius: 10,
    top: -3,
    left: -3,
    bottom: -3,
    right: -3,
    opacity: 0,
    transition: 'border-color 150ms ease, opacity 150ms ease',
  },
  selectors: {
    [`&:focus:before`]: {
      borderWidth: 3,
      borderStyle: 'solid',
      borderColor: theme.color.mint400,
      opacity: 1,
      outline: 0,
    },
    [`&:focus:hover`]: {
      borderColor: theme.color.white,
    },
  },
})

export const visible = style({
  opacity: 1,
})

export const focused = style({
  ':before': {
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: theme.color.mint400,
    opacity: 1,
    outline: 0,
  },
  ':hover': {
    borderColor: theme.color.white,
  },
})
