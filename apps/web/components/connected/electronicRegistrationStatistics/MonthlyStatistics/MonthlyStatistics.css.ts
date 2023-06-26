import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

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
