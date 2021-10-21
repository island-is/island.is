/* eslint-disable no-useless-computed-key */
import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  boxSizing: 'border-box',
  margin: '0 auto',
  maxWidth: theme.breakpoints.xl,
  paddingLeft: theme.grid.gutter.mobile * 2,
  paddingRight: theme.grid.gutter.mobile * 2,
  width: '100%',
  selectors: {
    // Opt out of horizontal padding on nested grids
    ['& &']: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      paddingLeft: theme.grid.gutter.desktop * 2,
      paddingRight: theme.grid.gutter.desktop * 2,
      selectors: {
        ['& &']: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
  },
})
