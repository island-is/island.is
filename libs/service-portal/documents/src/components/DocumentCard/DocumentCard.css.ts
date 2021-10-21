import { style } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'

export const modalButtonWrapper = style({
  ...themeUtils.responsiveStyle({
    sm: {
      width: '100%',
    },
    lg: {
      width: 'fit-content',
    },
  }),
})
