import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const searchWidth = style({
  minWidth: '100%',
  ...themeUtils.responsiveStyle({
    xs: {
      minWidth: '50%',
    },
  }),
})
