import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const img = style({
  maxHeight: '25vh',
  ...themeUtils.responsiveStyle({
    md: {
      maxHeight: 'unset',
    },
  }),
})
