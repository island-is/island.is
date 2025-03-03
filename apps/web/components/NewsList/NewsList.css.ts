import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const digitalIcelandNewsCardVariantContainer = style({
  display: 'grid',
  gap: theme.spacing[4],

  ...themeUtils.responsiveStyle({
    xs: {
      gridTemplateColumns: 'minmax(230px, 500px)',
      justifyContent: 'center',
    },
    md: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(302px, 1fr))',
    },
  }),
})
