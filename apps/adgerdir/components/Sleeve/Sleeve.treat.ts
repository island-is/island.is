import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  position: 'relative',
})

export const wrapper = style({
  overflow: 'hidden',
  ':after': {
    content: '""',
    position: 'absolute',
    bottom: -42,
    height: 42,
    width: '100%',
    pointerEvents: 'none',
    boxShadow: '0px -20px 20px rgba(255, 153, 137, 0.15)',
  },
})

export const open = style({})

export const toggler = style({
  backgroundColor: theme.color.blue400,
  width: 64,
  height: 64,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  outline: 0,
  transform: 'rotate(180deg)',
  transition: 'transform 1s ease',
})

export const togglerOpen = style({
  transform: 'rotate(0)',
})

export const togglerWrapper = style({
  position: 'absolute',
  left: 0,
  right: 0,
  marginLeft: 'auto',
  marginRight: 'auto',
  width: 64,
  bottom: -32,
})
