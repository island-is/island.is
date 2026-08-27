import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const userAvatar = style({
  width: 48,
  height: 48,
  flexShrink: 0,
})

export const userAvatarLarge = style({
  ...themeUtils.responsiveStyle({
    lg: {
      width: 56,
      height: 56,
    },
  }),
})
