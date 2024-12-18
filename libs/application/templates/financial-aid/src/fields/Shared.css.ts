import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const inputContainer = style({
  maxHeight: '0',
  overflow: 'hidden',
  transition: 'max-height 300ms ease',
})

export const inputAppear = style({
  maxHeight: '300px',
})

export const formAppear = style({
  maxHeight: '400px',
})

export const filesButtons = style({
  selectors: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
})

export const summaryBlockChild = style({
  minWidth: '50%',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      minWidth: '83%',
    },
  },
})

export const confirmationIllustration = style({
  marginTop: theme.spacing[5],
  display: 'none',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      display: 'block',
    },
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      display: 'block',
    },
  },
})

export const errorMessage = style({
  overflow: 'hidden',
  maxHeight: '0',
  transition: 'max-height 250ms ease',
})
export const showErrorMessage = style({
  maxHeight: theme.spacing[5],
})
