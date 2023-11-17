import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const linkContainer = style({
  height: '39.5px',
  ...themeUtils.responsiveStyle({
    md: {
      alignSelf: 'flex-end',
      height: '48px',
    },
  }),
})
