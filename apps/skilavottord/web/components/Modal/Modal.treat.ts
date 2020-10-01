import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const container = style({
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
})

export const overlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: '70%',
  '@keyframes': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 0.7,
    },
  },
  animationTimingFunction: 'ease-out',
  animationDuration: '0.25s',
})

export const modal = style({
  position: 'relative',
  boxShadow: '0px 4px 70px rgba(0, 97, 255, 0.1)',
  zIndex: 1,
  '@keyframes': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
  animationTimingFunction: 'ease-out',
  animationDuration: '0.25s',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      height: '100vh',
    },
  },
})

export const modalClose = style({
  position: 'absolute',
  top: 30,
  right: 30,
  lineHeight: 0,
  outline: 0,
})

export const indent = style({
 
})
