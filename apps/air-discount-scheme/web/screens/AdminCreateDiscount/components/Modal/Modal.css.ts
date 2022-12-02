import { style, keyframes } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
})

const overlayFade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: '30%',
  },
})

export const overlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  opacity: '30%',
  backgroundColor: theme.color.blue600,
  animationName: overlayFade,
  animationTimingFunction: 'ease-out',
  animationDuration: '0.25s',
})

const modalFade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

export const modal = style({
  position: 'relative',
  flexGrow: 0,

  zIndex: 1,
  borderRadius: '16px',
  boxSizing: 'border-box',
  backgroundColor: theme.color.white,
  animationName: modalFade,
  animationTimingFunction: 'ease-out',
  animationDuration: '0.25s',
})

export const modalClose = style({
  position: 'absolute',
  top: 15,
  right: 15,
  width: 40,
  height: 40,
  lineHeight: 0,
  outline: 0,
})
