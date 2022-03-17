import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const hidden = style({
  ...themeUtils.responsiveStyle({
    md: {
      visibility: 'hidden',
    },
  }),
})

export const bottomBorder = style({
  ...themeUtils.responsiveStyle({
    md: {
      borderBottom: theme.border.width.standard,
    },
  }),
})
