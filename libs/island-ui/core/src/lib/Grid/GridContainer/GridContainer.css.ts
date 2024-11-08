/* eslint-disable no-useless-computed-key */
import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  boxSizing: 'border-box',
  margin: '0 auto',
  maxWidth: theme.breakpoints.xl,
  paddingLeft: theme.spacing[2],
  paddingRight: theme.spacing[2],
  width: '100%',
  selectors: {
    // Opt out of horizontal padding on nested grids
    ['& &']: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      paddingLeft: theme.spacing[3],
      paddingRight: theme.spacing[3],
      selectors: {
        ['& &']: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      paddingLeft: theme.spacing[6],
      paddingRight: theme.spacing[6],
      selectors: {
        ['& &']: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
  },
})
