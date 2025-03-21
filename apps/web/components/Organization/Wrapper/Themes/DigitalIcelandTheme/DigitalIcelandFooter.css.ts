import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const container = style({
  display: 'grid',
  ...themeUtils.responsiveStyle({
    xs: {
      gap: '24px',
    },
    md: {
      gridTemplateColumns: '80px 1fr',
      gap: '8px',
    },
  }),
})
