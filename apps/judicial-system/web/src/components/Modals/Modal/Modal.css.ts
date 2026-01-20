import { style, styleVariants } from '@vanilla-extract/css'

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
