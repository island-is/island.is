import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const imageContainer = style({
  position: 'relative',
  maxWidth: '20%',
  width: '100%',
})

export const imageContainerStacked = style({
  maxWidth: '50%',
})

export const imageContainerHidden = style({
  display: 'none',
  ...themeUtils.responsiveStyle({
    sm: {
      display: 'flex',
    },
  }),
})
