import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const dropdown = style({
  width: 'auto',
  ...themeUtils.responsiveStyle({
    md: {
      width: 318,
    },
  }),
})
