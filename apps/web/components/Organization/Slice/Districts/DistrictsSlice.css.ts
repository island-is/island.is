import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const districtsList = style({
  columnGap: 30,
  ...themeUtils.responsiveStyle({
    xs: {
      columnCount: 1,
    },
    sm: {
      columnCount: 2,
    },
    md: {
      columnCount: 1,
    },
    lg: {
      columnCount: 2,
    },
  }),
})
