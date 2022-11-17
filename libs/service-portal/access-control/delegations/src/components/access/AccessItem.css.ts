import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const hidden = style({
  display: 'none',
  ...themeUtils.responsiveStyle({
    md: {
      visibility: 'hidden',
    },
  }),
})

export const row = style({
  padding: '20px 0',
})

export const item = style({
  display: 'flex',
  alignItems: 'flex-start',
})

export const rowGap = style({
  rowGap: theme.spacing[1] / 2,
})

export const dividerContainer = style({
  ...themeUtils.responsiveStyle({
    xs: {
      marginLeft: -theme.grid.gutter.desktop,
      marginRight: -theme.grid.gutter.desktop,
    },
    md: {
      marginLeft: -theme.grid.gutter.desktop / 2,
      marginRight: -theme.grid.gutter.desktop / 2,
    },
  }),
})
