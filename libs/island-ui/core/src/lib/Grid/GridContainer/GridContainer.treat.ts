import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  boxSizing: 'border-box',
  margin: '0 auto',
  maxWidth: theme.breakpoints.xl,
  paddingLeft: theme.grid.gutter.mobile,
  paddingRight: theme.grid.gutter.mobile,
  position: 'relative',
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
      paddingLeft: theme.grid.gutter.desktop,
      paddingRight: theme.grid.gutter.desktop,
      selectors: {
        ['& &']: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
  },
})
