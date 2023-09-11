import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const button = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg}px) and (min-width: ${theme.breakpoints.md}px)`]:
      {
        width: '100%',
      },
  },
})

export const continueButton = style({
  marginLeft: theme.spacing[2],

  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg}px) and (min-width: ${theme.breakpoints.md}px)`]:
      {
        marginBottom: theme.spacing[2],
        marginLeft: 0,
      },
  },
})

export const infoBoxContainer = style({
  maxWidth: '304px',
  width: '100%',

  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg}px) and (min-width: ${theme.breakpoints.md}px)`]:
      {
        maxWidth: 'unset',
      },
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      maxWidth: '376px',
    },
  },
})
