import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const sidebar = style({
  minWidth: '230px',
  maxWidth: '230px',
  ...themeUtils.responsiveStyle({
    lg: {
      minWidth: '318px',
      maxWidth: '318px',
    },
  }),
})

export const contentWrapper = style({
  maxWidth: 'calc(100% - 230px)',
  ...themeUtils.responsiveStyle({
    lg: {
      maxWidth: 'calc(100% - 318px)',
    },
  }),
})
