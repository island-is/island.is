import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

const gap = theme.spacing[6]

export const container = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  rowGap: gap,
  columnGap: gap,
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateColumns: '1fr 1fr',
    },
    xl: {
      gridTemplateColumns: '2fr 1fr',
    },
  }),
})

export const firstColumn = style({
  gridRow: 2,
  ...themeUtils.responsiveStyle({
    lg: {
      gridRow: 1,
    },
  }),
})

export const secondColumn = style({
  gridRow: 1,
  ...themeUtils.responsiveStyle({
    lg: {
      gridRow: 1,
    },
  }),
})
