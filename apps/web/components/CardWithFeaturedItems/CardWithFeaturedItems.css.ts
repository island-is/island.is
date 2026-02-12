import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const container = style({
  height: 260,
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
  scrollSnapAlign: 'start',
})

export const image = style({
  width: 100,
  height: 'auto',
  maxWidth: 100,
  maxHeight: 100,
  marginTop: 10,
  ...themeUtils.responsiveStyle({
    xl: {
      width: 120,
      maxWidth: 120,
      maxHeight: 120,
      marginRight: 20,
    },
  }),
})
