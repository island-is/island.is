import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const gridRowEqual = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridGap: theme.spacing[1],
  marginBottom: theme.spacing[1],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      gridTemplateColumns: '1fr 1fr',
    },

    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridTemplateColumns: '1fr',
    },

    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
})

export const gridRow2fr1fr = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridGap: theme.spacing[1],
  marginBottom: theme.spacing[1],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      gridTemplateColumns: '2fr 1fr',
    },

    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridTemplateColumns: '1fr',
    },

    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: '2fr 1fr',
    },
  },
})
