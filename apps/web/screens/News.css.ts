import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const image = style({
  ...themeUtils.responsiveStyle({
    sm: {
      float: 'right',
      width: '50%',
      marginLeft: '16px',
    },
  }),
})
