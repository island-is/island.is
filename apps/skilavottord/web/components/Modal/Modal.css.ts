import { theme } from '@island.is/island-ui/theme'
import { keyframes, style } from '@vanilla-extract/css'

export const container = style({
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
})

const overlayAnimation = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 0.7,
  },
})

export const overlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0.7,
  background: theme.color.blue100,
  animationName: overlayAnimation,
  animationTimingFunction: 'ease-out',
  animationDuration: '0.25s',
})

const containerAnimation = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

export const modalContainer = style({
  position: 'relative',
  boxShadow: '0px 4px 70px rgba(0, 97, 255, 0.1)',
  zIndex: 1,
  animationName: containerAnimation,
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
  top: 8,
  right: 8,
  lineHeight: 0,
  outline: 0,
})
