import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const barChartContainer = style({
  overflowX: 'scroll',
  overflowY: 'hidden',
  minHeight: 368,
  ...themeUtils.responsiveStyle({
    xl: {
      overflowX: 'hidden',
    },
  }),
})
