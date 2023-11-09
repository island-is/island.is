import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const gridContainer = style({
  overflow: 'visible',
  padding: 0,
})

export const container = style({
  width: '100%',
  overflowX: 'auto',
})

export const wrapper = style({
  display: 'grid',
  ...themeUtils.responsiveStyle({
    xs: {
      columnGap: theme.spacing[2],
      rowGap: theme.spacing[2],
      paddingLeft: theme.grid.gutter.mobile * 2,
      paddingRight: theme.grid.gutter.mobile * 2,
    },
    sm: {
      columnGap: theme.spacing[3],
      rowGap: theme.spacing[3],
      width: '100%',
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    md: {
      paddingLeft: theme.grid.gutter.desktop * 2,
      paddingRight: theme.grid.gutter.desktop * 2,
    },
    lg: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    xl: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  }),
})

export const half = style({
  gridTemplateColumns: 'repeat(2, 1fr)',
  ...themeUtils.responsiveStyle({
    xs: {
      width: theme.breakpoints.sm + 70,
    },
    sm: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    lg: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    xl: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  }),
})

export const quarter = style({
  gridTemplateColumns: 'repeat(4, 1fr)',
  ...themeUtils.responsiveStyle({
    xs: {
      width: theme.breakpoints.sm + 70,
    },
    sm: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
    lg: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
    xl: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  }),
})
