import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const infoCard = style({
  minWidth: 310,
  ...themeUtils.responsiveStyle({
    md: {
      minWidth: 477,
    },
    lg: {
      maxWidth: 978,
      width: '100%',
    },
  }),
})

export const infoCardWide = style({
  maxWidth: 978,
  width: '100%',
})

export const wideTitleBox = style({
  flexGrow: 2,
})
