import { style } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'

export const selectDesktop = style({
  zIndex: 2,

  ...themeUtils.responsiveStyle({
    xs: { width: '50%' },
    md: { width: 220 },
    lg: { width: 220 },
    xl: { width: 220 },
  }),
})
