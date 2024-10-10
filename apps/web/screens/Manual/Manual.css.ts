import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const link = style({
  fontWeight: 300,
})

export const inputContainer = style({
  ...themeUtils.responsiveStyle({
    lg: {
      maxWidth: '660px',
    },
  }),
})
