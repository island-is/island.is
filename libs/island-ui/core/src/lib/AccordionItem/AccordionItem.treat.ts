import { style, styleMap } from 'treat'
import { theme, blue100 } from '@island.is/island-ui/theme'

export const button = style({})

export const iconTilted = style({
  transform: 'rotate(45deg)',
})

export const focusRing = [
  style({
    selectors: {
      [`${button}:focus ~ &`]: {
        opacity: 1,
      },
    },
  }),
  style({
    top: -theme.spacing[1],
    bottom: -theme.spacing[1],
    left: -theme.spacing[1],
    right: -theme.spacing[1],
  }),
]

export const card = style({
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  cursor: 'pointer',
  borderWidth: 1,
  boxSizing: 'border-box',
  borderStyle: 'solid',
  borderColor: theme.color.blue200,
  transition: 'border-color 150ms ease',
  borderRadius: theme.border.radius.large,
  textDecoration: 'none',
  position: 'relative',
  ':hover': {
    borderWidth: 1,
    borderColor: theme.color.blue400,
    textDecoration: 'none',
  },
  ':focus': {
    outline: 0,
  },
  '::before': {
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
    [`&:focus::before`]: {
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

export const focused = style({
  '::before': {
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

export const plusIconWrap = style({
  width: 40,
  height: 40,
  backgroundColor: theme.color.blue100,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
})

export const iconVariants = styleMap({
  default: {
    backgroundColor: theme.color.blue100,
    color: theme.color.blue400,
  },
  sidebar: {
    backgroundColor: theme.color.purple200,
    color: theme.color.purple400,
  },
})

export const plusIcon = style({
  display: 'flex',
  transform: 'rotateZ(0)',
  transformOrigin: 'center',
  transition: 'transform 300ms',
})

export const plusIconActive = style({
  transform: 'rotateZ(90deg)',
})

export const plusIconX = style({
  fill: 'currentColor',
})

export const plusIconXActive = style({
  opacity: 0,
})

export const plusIconY = style({
  fill: 'currentColor',
})
