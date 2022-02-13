import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const bank = style({
  marginRight: theme.spacing['1'],
  maxWidth: '120px',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '90px',
    },
  },
})

export const hb = style({
  marginRight: theme.spacing['1'],
  maxWidth: '90px',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '60px',
    },
  },
})

export const account = style({
  marginRight: theme.spacing['1'],
})
