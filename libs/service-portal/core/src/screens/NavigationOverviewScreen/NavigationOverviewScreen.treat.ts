import { themeUtils } from 'libs/island-ui/theme/src'
import { style } from 'treat'

export const image = style({
  width: 120,
  ...themeUtils.responsiveStyle({
    sm: {
      width: 'inherit',
    },
  }),
})
