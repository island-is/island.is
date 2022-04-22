import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const bank = style({
  marginRight: theme.spacing['1'],
  maxWidth: '115px',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm - 1}px)`]: {
      maxWidth: '120px',
      marginBottom: theme.spacing['2'],
    },
  },
})

export const hb = style({
  marginRight: theme.spacing['1'],
  maxWidth: '92px',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm - 1}px)`]: {
      maxWidth: '100px',
      marginBottom: theme.spacing['2'],
    },
  },
})

export const account = style({
  marginRight: theme.spacing['1'],
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '200px',
    },
  },
})

export const formContainer = style({
  maxWidth: 400,
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      width: '100%',
    },
  },
})

export const codeInput = style({
  maxWidth: 210,
})

export const nudgeSave = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm - 1}px)`]: {
      marginTop: theme.spacing['2'],
      marginLeft: 0,
    },
  },
})

export const countryCodeInput = style({
  marginRight: theme.spacing['2'],
  maxWidth: '120px',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '90px',
    },
  },
})
