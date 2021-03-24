import { themeUtils } from '@island.is/island-ui/core'
import { style } from 'treat'

export const avatar = style({
  width: 50,
  height: 50,
  ...themeUtils.responsiveStyle({
    sm: {
      width: 76,
      height: 76,
    },
  }),
})
