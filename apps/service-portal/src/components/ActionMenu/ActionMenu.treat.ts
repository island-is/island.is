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
  opacity: 0,
  zIndex: 2,
  '@keyframes': {
    '0%': { opacity: 0, transform: 'translate3d(10px, -10px, 0)' },
    '100%': { opacity: 1, transform: 'translate3d(0px, 0px, 0)' },
  },
  animation: '@keyframes 150ms ease forwards',
})
