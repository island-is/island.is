import { keyframes, style, styleVariants } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})

export const container = style({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  background: 'rgba(203, 203, 215, 0.8)',
  animation: `${fadeIn} 0.3s ease-in-out`,
  transition: 'opacity 0.2s ease-in-out',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      transition: 'none',
    },
  },
})

// Fades out over the same 0.2s as the dialog's exit, so both leave together.
// The entrance animation is cancelled so a close inside its first 0.3s, say
// an immediate Escape, fades out rather than finishing the fade in.
export const leaving = style({
  opacity: 0,
  animation: 'none',
})

export const alignItems = styleVariants({
  center: {
    alignItems: 'center',
  },
  top: {
    alignItems: 'flex-start',
  },
  bottom: {
    alignItems: 'flex-end',
  },
})

export const modalContainer = style({
  position: 'relative',
  padding: `${theme.spacing[8]}px ${theme.spacing[8]}px 0px ${theme.spacing[8]}px`,
  background: theme.color.white,
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflowY: 'auto',
  borderRadius: theme.border.radius.standard,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      maxWidth: '70vw',
    },
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      maxWidth: '50vw',
    },
  },
})

export const backdropButton = style({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  padding: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'default',
})

export const modalContainerBare = style({
  position: 'relative',
  background: theme.color.white,
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflowY: 'auto',
  borderRadius: theme.border.radius.standard,
  zIndex: 100,
  margin: `${theme.spacing[10]}px 0`,
})

export const closeButton = style({
  padding: theme.spacing[4],
})

export const breakSpaces = style({
  whiteSpace: 'break-spaces',
})
