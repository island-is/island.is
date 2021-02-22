import { themeUtils } from '@island.is/island-ui/theme'
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
