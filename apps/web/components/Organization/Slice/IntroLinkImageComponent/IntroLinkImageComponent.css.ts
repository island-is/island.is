import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const image = style({
  ...themeUtils.responsiveStyle({
    xs: {
      maxHeight: '150px',
    },
    sm: {
      maxHeight: 'unset',
    },
  }),
})

export const smallImage = style({
  maxHeight: '150px',
})
