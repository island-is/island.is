import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const wrapper = style({
  display: 'grid',
  gap: theme.spacing[2],
  gridTemplateColumns: '1fr',
  width: '100%',
})

export const wrapperOneColumn = style({
  gridTemplateColumns: '1fr',
})

export const wrapperTwoColumns = style({
  ...themeUtils.responsiveStyle({
    xs: {
      gridTemplateColumns: '1fr',
    },
    md: {
      gridTemplateColumns: '1fr 1fr',
    },
  }),
})

export const wrapperThreeColumns = style({
  ...themeUtils.responsiveStyle({
    xs: {
      gridTemplateColumns: '1fr 1fr',
    },
    xl: {
      gridTemplateColumns: '1fr 1fr 1fr',
    },
  }),
})

export const wrapperFourColumns = style({
  ...themeUtils.responsiveStyle({
    xs: {
      gridTemplateColumns: '1fr 1fr',
    },
    xl: {
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
    },
  }),
})
