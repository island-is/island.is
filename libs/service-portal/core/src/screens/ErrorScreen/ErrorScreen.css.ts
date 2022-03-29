import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const img = style({
  maxHeight: '25vh',
  minHeight: '20vh',
  ...themeUtils.responsiveStyle({
    md: {
      maxHeight: 'unset',
      minHeight: '30vh',
    },
  }),
})
