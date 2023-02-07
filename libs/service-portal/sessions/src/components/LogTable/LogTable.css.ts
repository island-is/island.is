import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const divider = style({
  gridColumn: '1 / -1',
  marginLeft: -theme.grid.gutter.desktop,
  marginRight: -theme.grid.gutter.desktop,
  ...themeUtils.responsiveStyle({
    md: {
      marginLeft: -theme.grid.gutter.desktop * 2,
      marginRight: -theme.grid.gutter.desktop * 2,
    },
    lg: {
      marginLeft: 0,
      marginRight: 0,
    },
  }),
})
