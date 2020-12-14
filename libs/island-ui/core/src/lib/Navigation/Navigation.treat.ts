import { style, styleMap } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const divider = style({
  width: '100%',
  height: 1,
})

export const root = style({
  transition: 'background-color 150ms',
})

export const ul = style({
  borderLeftWidth: 1,
  borderLeftStyle: 'solid',
  borderLeftColor: theme.color.transparent,
})

export const colorScheme = styleMap({
  blue: {},
  purple: {},
  darkBlue: {},
})

export const link = style({
  ':hover': {
    textDecoration: 'none',
  },
})

export const level = styleMap({
  1: {
    padding: 0,
  },
  2: {
    marginTop: theme.spacing[1],
    marginBottom: theme.spacing[1],
    marginLeft: theme.spacing[3],
    marginRight: theme.spacing[3],
  },
})

export const menuBtn = style({
  width: '100%',
  cursor: 'pointer',
  outline: 'none',
  borderRadius: 8,
  padding: theme.spacing[1],
  transition: 'box-shadow .25s, color .25s, background-color .25s',
  ':focus': {
    boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
  },
  ':active': {
    boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
  },
})

export const menuIcon = style({
  position: 'absolute',
  top: '2px',
  right: '8px',
})

export const dropdownIcon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.color.white,
  height: 24,
  width: 24,
  borderRadius: '50%',
})

export const menuShadow = styleMap({
  blue: {
    boxShadow: ' 0px 4px 30px rgba(0, 97, 255, 0.25)',
  },
  purple: {
    boxShadow: ' 0px 4px 30px rgba(106, 46, 160, 0.25)',
  },
  darkBlue: {
    boxShadow: ' 0px 4px 30px rgba(0, 0, 60, 0.25)',
  },
})

export const transition = style({
  opacity: 0,
  transition: 'opacity 150ms ease-in-out',
  selectors: {
    '&[data-enter]': {
      opacity: 1,
    },
  },
})
