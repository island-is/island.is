import { style, keyframes } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const trigger = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: 32,
  height: 32,
  padding: theme.spacing['1'],
  borderRadius: '100%',
  transition: 'background-color 200ms',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: theme.color.blue200,
  },
  ':focus': {
    outline: 'none',
    backgroundColor: theme.color.mint200,
  },
})

const menuAnimation = keyframes({
  '0%': { opacity: 0, transform: 'translate3d(10px, -10px, 0)' },
  '100%': { opacity: 1, transform: 'translate3d(0px, 0px, 0)' },
})

export const menu = style({
  position: 'absolute',
  top: 10,
  right: 10,
  minWidth: 180,
  opacity: 0,
  zIndex: 2,
  animation: `${menuAnimation} 150ms ease forwards`,
})

export const menuItem = style({
  color: theme.color.blue600,
  fontSize: 15,
  transition: 'color 200ms',
  ':hover': {
    color: theme.color.purple400,
  },
  ':focus': {
    outline: 'none',
    color: theme.color.mint400,
  },
})

export const dot = style({
  width: 4,
  height: 4,
})
