import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const image = style({
  marginRight: '48px',
  minHeight: '100%',
  display: 'none',
  ...themeUtils.responsiveStyle({
    lg: {
      display: 'block',
    },
  }),
})
