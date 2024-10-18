import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const bg = style({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
})

export const hasBackgroundConfig = style({
  position: 'absolute',
  left: 0,
  bottom: 0,
  right: 0,
  ...themeUtils.responsiveStyle({
    xs: {
      top: '104px',
    },
    md: {
      top: '112px',
    },
  }),
})
