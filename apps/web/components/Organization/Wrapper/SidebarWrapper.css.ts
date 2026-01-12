import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const sidebarWrapper = style({
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: '230px',
      minWidth: '230px',
    },
    lg: {
      minWidth: '318px',
      maxWidth: '318px',
    },
  }),
})
