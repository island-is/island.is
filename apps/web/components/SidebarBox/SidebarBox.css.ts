import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const container = style({
  backgroundColor: theme.color.purple100,
  margin: `0 -24px`,
  ...themeUtils.responsiveStyle({
    md: {
      margin: 0,
      borderRadius: theme.border.radius.large,
    },
  }),
})
