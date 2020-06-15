import { style, styleMap } from 'treat'
import { theme } from '../../theme'

export const wrapper = style({
  display: 'inline-block',
  position: 'relative',
  width: '100%',
  ':after': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    pointerEvents: 'none',
    borderRadius: 6,
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: theme.color.mint400,
    opacity: 0,
  },
})

export const menuContainer = style({
  position: 'relative',
})

export const sizes = styleMap({
  medium: {},
  large: {},
})

export const focused = style({
  ':after': {
    opacity: 1,
  },
})

export const open = style({
  ':after': {
    borderBottomWidth: 0,
    borderRadius: '6px 6px 0 0',
  },
})

export const icon = style({
  position: 'absolute',
  top: '50%',
  right: 16,
  transform: 'translateY(-50%)',
  outline: 0,
  ':before': {
    content: '""',
    position: 'absolute',
    cursor: 'pointer',
    left: -10,
    right: -10,
    top: -10,
    bottom: -10,
  },
})
