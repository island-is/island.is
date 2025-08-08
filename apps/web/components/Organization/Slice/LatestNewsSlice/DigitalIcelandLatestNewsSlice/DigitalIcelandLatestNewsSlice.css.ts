import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const itemListContainer = style({
  display: 'grid',
  gap: theme.spacing[4],
  ...themeUtils.responsiveStyle({
    xs: {
      gridTemplateColumns: 'minmax(230px, 450px)',
      justifyContent: 'center',
    },
    md: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(302px, 340px))',
    },
    lg: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(302px, 400px))',
    },
    xl: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(302px, 1fr))',
    },
  }),
})
