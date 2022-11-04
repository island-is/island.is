import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const selectContainer = style({
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: 320,
    },
  }),
})
