import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const totalContainer = style({
  ...themeUtils.responsiveStyle({
    xs: {
      minWidth: '70px',
    },
    sm: {
      minWidth: '140px',
    },
    lg: {
      minWidth: '160px',
    },
    xl: {
      minWidth: '180px',
    },
  }),
})
