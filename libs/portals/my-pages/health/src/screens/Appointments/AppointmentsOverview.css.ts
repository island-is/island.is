import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const datePickerWrapper = style({
  ...themeUtils.responsiveStyle({
    xs: {
      width: '100%',
    },
    md: {
      width: 'fit-content',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  }),
})
