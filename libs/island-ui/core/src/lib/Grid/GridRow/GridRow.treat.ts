import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const grid = style({
  boxSizing: 'border-box',
  display: 'flex',
  flex: '0 1 auto',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginLeft: `-${theme.grid.gutter.mobile}px`,
  marginRight: `-${theme.grid.gutter.mobile}px`,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      marginLeft: `-${theme.grid.gutter.desktop / 2}px`,
      marginRight: `-${theme.grid.gutter.desktop / 2}px`,
    },
  },
})
