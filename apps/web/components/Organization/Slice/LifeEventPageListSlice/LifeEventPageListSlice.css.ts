import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const profileCardContainer = style({
  display: 'grid',
  gap: '24px',
  ...themeUtils.responsiveStyle({
    xs: {
      gridTemplateColumns: '1fr',
    },
    sm: {
      gridTemplateColumns: '1fr 1fr',
    },
    xl: {
      gridTemplateColumns: '1fr 1fr 1fr',
    },
  }),
})
