import { themeUtils } from 'libs/island-ui/theme/src'
import { style } from 'treat'

export const loadingWrapper = style({
  zIndex: 100,
})

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
