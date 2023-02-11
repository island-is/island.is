import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const button = style({
  ...themeUtils.responsiveStyle({
    xs: {
      alignSelf: 'stretch',
    },
    sm: {
      alignSelf: 'stretch',
    },
  }),
})
