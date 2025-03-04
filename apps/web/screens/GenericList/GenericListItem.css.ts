import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

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
  ...themeUtils.responsiveStyle({
    sm: {
      clear: 'both',
    },
  }),
})
