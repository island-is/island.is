import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const searchTermInput = style({
  ...themeUtils.responsiveStyle({
    xs: {
      width: '100%',
    },
    xl: {
      width: '888px',
    },
  }),
})
