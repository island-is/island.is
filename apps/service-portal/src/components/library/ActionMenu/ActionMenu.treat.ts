import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const trigger = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: 32,
  height: 32,
  padding: theme.spacing['1'],
  borderRadius: '100%',
  transition: '200ms ease',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: theme.color.blue200,
  },
})

export const menu = style({
  position: 'absolute',
  top: 0,
  right: 0,
  minWidth: 180,
  padding: theme.spacing['2'],
  boxShadow: theme.shadows.subtle,
  backgroundColor: theme.color.white,
  borderRadius: 4,
  transition: 'opacity 200ms, transform 200ms',
})

export const menuOpen = style({
  opacity: 1,
  transform: 'translate3d(0, 0, 0)',
})

export const menuClosed = style({
  opacity: 0,
  transform: 'translate3d(10px, -10px, 0)',
  visibility: 'hidden',
})

export const menuItem = style({
  fontSize: 14,
  fontWeight: 500,
  textAlign: 'left',
  ':hover': {
    color: theme.color.blue400,
  },
  transition: 'color 200ms',
})
