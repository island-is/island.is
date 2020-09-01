import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  width: '100%',
  maxWidth: 1440,
  margin: '0 auto',
  boxSizing: 'border-box',
  paddingRight: theme.grid.gutter.mobile,
  paddingLeft: theme.grid.gutter.mobile,
  position: 'relative',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      paddingRight: theme.grid.gutter.desktop,
      paddingLeft: theme.grid.gutter.desktop,
    },
  },
})
