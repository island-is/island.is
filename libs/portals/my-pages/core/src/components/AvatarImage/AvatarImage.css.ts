import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const image = style({
  width: 28,
  height: 28,
})

export const imageContainer = style({
  minWidth: 48,
  minHeight: 48,
  maxHeight: 48,
  maxWidth: 48,
  transition: 'background-color .25s',
})

export const largeAvatar = style({
  ...themeUtils.responsiveStyle({
    lg: {
      minWidth: 56,
      minHeight: 56,
      maxHeight: 56,
      maxWidth: 56,
    },
  }),
})
