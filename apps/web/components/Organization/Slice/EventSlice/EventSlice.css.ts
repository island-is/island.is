import { globalStyle, style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const wrapper = style({
  padding: '30px 40px 30px 40px !important',
  backgroundSize: 'cover !important',
  backgroundPositionY: 'center !important',
})

export const textWrapper = style({
  ...themeUtils.responsiveStyle({
    xl: {
      marginTop: '20px',
    },
  }),
})

globalStyle(`${textWrapper} p`, {
  ...themeUtils.responsiveStyle({
    xl: {
      fontSize: '72px !important',
    },
  }),
})
