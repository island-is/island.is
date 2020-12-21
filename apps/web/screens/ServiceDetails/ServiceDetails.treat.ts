import { style } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'

export const showMobile = style({
  ...themeUtils.responsiveStyle({
    xs: { display: 'inline' },
    sm: { display: 'none' },
  }),
})

export const showDesktop = style({
  ...themeUtils.responsiveStyle({
    xs: { display: 'none' },
    sm: { display: 'inline' },
  }),
})
