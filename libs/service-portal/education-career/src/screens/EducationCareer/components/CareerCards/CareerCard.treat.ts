import { themeUtils } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const img = style({
  width: 50,
  height: 50,
  ...themeUtils.responsiveStyle({
    sm: {
      width: 76,
      height: 76,
    },
  }),
})

export const imgText = style({
  fontSize: 24,
  ...themeUtils.responsiveStyle({
    sm: {
      fontSize: 32,
    },
  }),
})
