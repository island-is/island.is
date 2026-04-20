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

  ...themeUtils.responsiveStyle({
    md: {
      paddingTop: theme.grid.gutter.desktop * 2,
      paddingBottom: theme.grid.gutter.desktop * 2,
    },
  }),
})

export const content = style({
  maxWidth: 600,
  width: '100%',
  flexShrink: 0,
  margin: '0 auto',
})
