import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const resetMarginGutter = style({
  ...themeUtils.responsiveStyle({
    md: {
      marginLeft: theme.grid.gutter.desktop / 2,
      marginRight: theme.grid.gutter.desktop / 2,
    },
  }),
})
