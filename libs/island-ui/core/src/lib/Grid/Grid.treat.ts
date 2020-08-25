import { style, globalStyle } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const grid = style({
  boxSizing: 'border-box',
  display: 'flex',
  flex: '0 1 auto',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginRight: `-${theme.grid.gutter.mobile}px`,
  marginLeft: `-${theme.grid.gutter.mobile}px`,

  '@media': {
    [`screen and min-width(${theme.breakpoints.md}px)`]: {
      paddingRight: `-${theme.grid.gutter.desktop}px`,
      paddingLeft: `-${theme.grid.gutter.desktop}px`,
    },
  },
})
