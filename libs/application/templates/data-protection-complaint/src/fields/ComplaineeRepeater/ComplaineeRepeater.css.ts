import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const removeFieldButton = style({
  top: 3,
  left: -theme.spacing['3'],

  ...themeUtils.responsiveStyle({
    md: {
      left: -theme.spacing['5'],
    },
  }),
})
