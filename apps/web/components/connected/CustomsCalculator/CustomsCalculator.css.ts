import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const dialog = style({
  ...themeUtils.responsiveStyle({
    md: {
      maxHeight: '50vh',
      overflowY: 'auto',
    },
  }),
})
