import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const relative = style({
  position: 'relative',
})

export const imageAbsolute = style({
  display: 'none',
  ...themeUtils.responsiveStyle({
    lg: {
      display: 'block',
      position: 'absolute',
      top: -252,
      right: 0,
      height: 'auto',
    },
  }),
})
