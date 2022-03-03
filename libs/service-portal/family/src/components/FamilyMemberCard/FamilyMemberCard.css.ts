import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const avatar = style({
  width: 50,
  height: 50,
  ...themeUtils.responsiveStyle({
    sm: {
      width: 66,
      height: 66,
    },
  }),
})
