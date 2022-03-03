import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const removeFieldButton = style({
  top: 3,
  left: -theme.spacing['3'],

  ...themeUtils.responsiveStyle({
    md: {
      left: -theme.spacing['5'],
    },
  }),
})
