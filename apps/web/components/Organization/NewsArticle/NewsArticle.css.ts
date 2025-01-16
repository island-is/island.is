import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const floatedImage = style({
  ...themeUtils.responsiveStyle({
    sm: {
      float: 'right',
      width: '50%',
      marginLeft: '16px',
    },
  }),
})

export const clearBoth = style({
  clear: 'both',
})
