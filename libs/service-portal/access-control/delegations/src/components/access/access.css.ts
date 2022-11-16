import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const divider = style({
  marginLeft: -theme.grid.gutter.desktop,
  marginRight: -theme.grid.gutter.desktop,
  ...themeUtils.responsiveStyle({
    md: {
      marginLeft: 0,
      marginRight: 0,
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
      gridTemplateColumns: 'repeat(1, 1fr) repeat(1, 2fr) repeat(1, 1fr)',
    },
  }),
})

export const gridRowMaxTwoCols = style({
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateColumns: 'repeat(1, 1fr) repeat(1, 2fr)',
    },
  }),
})
