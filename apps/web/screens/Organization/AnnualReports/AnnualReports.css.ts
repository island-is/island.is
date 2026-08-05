import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const profileCardContainer = style({
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: '1fr',
  ...themeUtils.responsiveStyle({
    sm: {
      gridTemplateColumns: '1fr 1fr',
    },
  }),
})
