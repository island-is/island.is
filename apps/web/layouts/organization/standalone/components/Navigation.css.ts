import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const logo = style({
  maxWidth: '50px',
})

export const gridRow = style({
  ...themeUtils.responsiveStyle({
    xs: {
      paddingTop: 16,
      paddingBottom: 16,
    },
    md: {
      paddingTop: 32,
      paddingBottom: 32,
    },
  }),
})
