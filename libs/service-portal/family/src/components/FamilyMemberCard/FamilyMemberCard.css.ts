import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const avatar = style({
  width: 50,
  height: 50,
  ...themeUtils.responsiveStyle({
    sm: {
      width: 76,
      height: 76,
    },
  }),
})
