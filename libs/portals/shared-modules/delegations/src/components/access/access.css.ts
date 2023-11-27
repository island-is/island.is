import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const divider = style({
  gridColumn: '1 / -1',
  marginLeft: -theme.grid.gutter.desktop,
  marginRight: -theme.grid.gutter.desktop,
  ...themeUtils.responsiveStyle({
    md: {
      marginLeft: 0,
      marginRight: 0,
    },
  }),
})

export const grid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridColumnGap: theme.spacing[1],
  gridRowGap: theme.spacing[3],
  ...themeUtils.responsiveStyle({
    lg: {
      gridRowGap: 'initial',
      gridColumnGap: 'initial',
    },
  }),
})

export const gridItem = style({
  ...themeUtils.responsiveStyle({
    lg: {
      paddingTop: theme.spacing[2],
      paddingBottom: theme.spacing[2],
      paddingRight: theme.spacing[2],
    },
  }),
})

export const gridThreeCols = style({
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateColumns: '1fr 2fr 1fr',
    },
  }),
})

export const gridTwoCols = style({
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateColumns: '1fr 2fr',
    },
  }),
})

export const dateContainer = style({
  display: 'flex',
  alignItems: 'flex-start',
  columnGap: theme.spacing[1] / 2,
  whiteSpace: 'pre',
})
