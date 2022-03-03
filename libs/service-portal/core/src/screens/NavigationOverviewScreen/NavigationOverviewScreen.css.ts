import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const image = style({
  width: 120,
  ...themeUtils.responsiveStyle({
    sm: {
      width: 'inherit',
    },
  }),
})
