import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const modal = style({
  display: 'flex',
  width: '100%',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.grid.gutter.mobile * 2,
  paddingBottom: theme.grid.gutter.mobile * 2,

  // boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.16)',
  ...themeUtils.responsiveStyle({
    md: {
      paddingTop: theme.grid.gutter.desktop * 2,
      paddingBottom: theme.grid.gutter.desktop * 2,
    },
  }),
})
