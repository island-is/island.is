import { style } from 'treat'
import { themeUtils } from '@island.is/island-ui/core'

export const districtsList = style({
  columnGap: 30,
  ...themeUtils.responsiveStyle({
    xs: {
      columnCount: 1,
    },
    sm: {
      columnCount: 2,
    },
    lg: { columnCount: 3 },
  }),
})
