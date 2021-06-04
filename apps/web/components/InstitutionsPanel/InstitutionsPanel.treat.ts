import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const imgContainer = style({
  width: 65,
  ...themeUtils.responsiveStyle({
    lg: {
      width: 100,
    },
  }),
})

export const negativeTop = style({
  marginTop: -theme.spacing[3],
})
