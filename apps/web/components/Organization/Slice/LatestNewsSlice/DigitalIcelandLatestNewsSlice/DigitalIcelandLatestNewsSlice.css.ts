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
    lg: {
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: theme.spacing[3],
    },
    xl: {
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: theme.spacing[4],
    },
  }),
})
