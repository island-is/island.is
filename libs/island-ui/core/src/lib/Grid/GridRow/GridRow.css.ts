import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const gridRow = style({
  boxSizing: 'border-box',
  display: 'flex',
  flex: '0 1 auto',
  flexWrap: 'wrap',
  marginLeft: `-${theme.grid.gutter.mobile / 2}px`,
  marginRight: `-${theme.grid.gutter.mobile / 2}px`,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      marginLeft: `-${theme.grid.gutter.desktop / 2}px`,
      marginRight: `-${theme.grid.gutter.desktop / 2}px`,
    },
  },
})
