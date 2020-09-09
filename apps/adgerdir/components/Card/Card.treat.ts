import { style, styleMap } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const card = style({
  display: 'flex',
  height: '100%',
  minWidth: '100%',
  flexDirection: 'column',
  backgroundColor: theme.color.white,
  flexGrow: 1,
  cursor: 'pointer',
  borderWidth: 1,
  boxSizing: 'border-box',
  borderStyle: 'solid',
  borderColor: theme.color.red200,
  borderRadius: theme.border.radius.large,
  textDecoration: 'none',
  position: 'relative',
  transition: 'border-color 150ms ease',
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

export const variants = styleMap({
  blue: {
    borderColor: theme.color.blue200,
    ':hover': {
      borderColor: theme.color.blue400,
    },
  },
  purple: {
    borderColor: theme.color.purple200,
    ':hover': {
      borderColor: theme.color.purple400,
    },
  },
  red: {
    borderColor: theme.color.red200,
    ':hover': {
      borderColor: theme.color.red400,
    },
  },
})

export const statusPosition = style({
  position: 'absolute',
  top: 16,
  right: 16,
})

export const status = style({
  display: 'inline-block',
  borderRadius: '50%',
  width: 8,
  height: 8,
})

export const statusType = styleMap({
  ongoing: {
    backgroundColor: theme.color.purple400,
  },
  preparing: {
    backgroundColor: theme.color.yellow600,
  },
  completed: {
    backgroundColor: theme.color.mint600,
  },
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
