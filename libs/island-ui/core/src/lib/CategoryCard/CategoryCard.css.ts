import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const imageContainerHidden = style({
  display: 'none',
  ...themeUtils.responsiveStyle({
    sm: {
      display: 'flex',
    },
  }),
})

export const image = style({
  width: 60,
  height: 60,
})
