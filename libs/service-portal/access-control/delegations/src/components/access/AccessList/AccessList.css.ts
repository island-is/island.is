import { themeUtils, theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const divider = style({
  marginLeft: -theme.grid.gutter.desktop,
  marginRight: -theme.grid.gutter.desktop,
  ...themeUtils.responsiveStyle({
    md: {
      marginLeft: 0,
      marginRight: 0,
    },
  }),
})
