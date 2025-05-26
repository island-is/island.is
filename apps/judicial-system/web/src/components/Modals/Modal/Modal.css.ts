import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

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
})

export const modalContainer = style({
  position: 'relative',
  padding: `${theme.spacing[8]}px ${theme.spacing[8]}px ${theme.spacing[6]}px ${theme.spacing[8]}px`,
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

export const closeButton = style({
  padding: theme.spacing[4],
})

export const breakSpaces = style({
  whiteSpace: 'break-spaces',
})
