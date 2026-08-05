import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const container = style({
  height: 260,
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
})

export const image = style({
  width: 120,
  height: 'auto',
  maxWidth: 120,
  maxHeight: 120,
  marginTop: 10,
  ...themeUtils.responsiveStyle({
    xl: {
      marginRight: 20,
    },
  }),
})
