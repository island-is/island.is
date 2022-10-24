import { themeUtils, theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  background:
    'linear-gradient(to bottom, rgba(255,255,255,0), white 80%, white)',
})

export const dividerContainer = style({
  ...themeUtils.responsiveStyle({
    xs: {
      marginLeft: -theme.grid.gutter.desktop,
      marginRight: -theme.grid.gutter.desktop,
    },
    sm: {
      marginLeft: 0,
      marginRight: 0,
    },
  }),
})
