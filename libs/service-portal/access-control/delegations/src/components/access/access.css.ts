import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const resetMarginGutter = style({
  ...themeUtils.responsiveStyle({
    md: {
      marginLeft: theme.grid.gutter.desktop / 2,
      marginRight: theme.grid.gutter.desktop / 2,
    },
  }),
})

export const gridRow = style({
  display: 'grid',
  gridTemplateRows: '1fr',
  gridColumnGap: theme.spacing[1],
  gridRowGap: theme.spacing[1] / 2,
  paddingTop: theme.spacing[2],
  paddingBottom: theme.spacing[2],
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateAreas: '1fr 1fr 1fr',
      padding: theme.spacing[2],
    },
  }),
})

export const gridRowMaxThreeCols = style({
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateColumns:
        'minmax(150px, 30%) minmax(200px, 50%) minmax(100px, 20%)',
    },
  }),
})

export const gridRowMaxTwoCols = style({
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateColumns: 'minmax(150px, 30%) minmax(200px, 70%)',
    },
  }),
})

export const gridRowValidityPeriod = style({
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateColumns:
        'minmax(150px, 30%) minmax(200px, 45%) minmax(150px, 25%)',
    },
  }),
})
