import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const image = style({
  marginRight: '48px',
  minHeight: '100%',
  display: 'none',
  ...themeUtils.responsiveStyle({
    xl: {
      display: 'block',
    },
  }),
})
