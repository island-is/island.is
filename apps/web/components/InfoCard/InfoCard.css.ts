import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const infoCard = style({
  width: 310,
  ...themeUtils.responsiveStyle({
    md: {
      width: 477,
    },
    lg: {
      width: '100%',
    },
  }),
})
