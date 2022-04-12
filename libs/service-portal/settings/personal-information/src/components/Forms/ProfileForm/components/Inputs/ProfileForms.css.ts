import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const bank = style({
  marginRight: theme.spacing['1'],
  maxWidth: '110px',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '90px',
    },
  },
})

export const hb = style({
  marginRight: theme.spacing['1'],
  maxWidth: '85px',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '60px',
    },
  },
})

export const account = style({
  marginRight: theme.spacing['1'],
})

export const formContainer = style({
  maxWidth: 400,
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      marginRight: 0,
      maxWidth: '100%',
    },
  },
})

export const codeInput = style({
  maxWidth: 210,
})

export const codeButton = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      alignSelf: 'flex-end',
      marginTop: theme.spacing['2'],
      paddingTop: 0,
    },
  },
})

export const nudgeSave = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
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
