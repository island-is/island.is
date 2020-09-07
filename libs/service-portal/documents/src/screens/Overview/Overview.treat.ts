import { style } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'

export const selectWrapper = style({
  width: '100%',
  ...themeUtils.responsiveStyle({
    sm: {
      width: '50%',
    },
    lg: {
      width: '35%',
    },
  }),
})
