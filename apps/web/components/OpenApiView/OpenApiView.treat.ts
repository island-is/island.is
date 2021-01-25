import { style } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'

export const selectDesktop = style({
  zIndex: 2,

  ...themeUtils.responsiveStyle({
    xs: { width: '100%' },
    md: { width: 144 },
    lg: { width: 220 },
    xl: { width: 316 },
  }),
})
