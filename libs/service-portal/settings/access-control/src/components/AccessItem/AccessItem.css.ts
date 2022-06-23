import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const hidden = style({
  display: 'none',
  ...themeUtils.responsiveStyle({
    md: {
      visibility: 'hidden',
    },
  }),
})

export const item = style({
  display: 'flex',
  alignItems: 'center',
})
