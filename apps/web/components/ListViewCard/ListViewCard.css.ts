import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const icon = style({
  minWidth: 30,
  width: 40,
  ...themeUtils.responsiveStyle({
    md: {
      minWidth: 40,
    },
  }),
})
