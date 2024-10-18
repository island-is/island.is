import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const removeFieldButton = style({
  top: '-94%',
  right: -theme.spacing['2'],
  ...themeUtils.responsiveStyle({
    md: {
      top: '50%',
      right: -theme.spacing['3'],
    },
  }),
})
