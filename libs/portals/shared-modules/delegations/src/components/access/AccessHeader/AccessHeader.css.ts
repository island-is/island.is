import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const firstColumn = style({
  width: '100%',
  flex: 1,
  ...themeUtils.responsiveStyle({
    lg: {
      flex: 1,
    },
    xl: {
      flex: 2,
    },
  }),
})

export const secondColumn = style({
  width: '100%',
  ...themeUtils.responsiveStyle({
    lg: {
      flex: 1,
    },
    xl: {
      flex: 1,
    },
  }),
})
