import { themeUtils, theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  background: theme.color.white,
  ...themeUtils.responsiveStyle({
    xs: {
      marginLeft: -theme.grid.gutter.desktop,
      marginRight: -theme.grid.gutter.desktop,
      paddingLeft: theme.grid.gutter.desktop,
      paddingRight: theme.grid.gutter.desktop,
    },
    md: {
      marginLeft: 'initial',
      marginRight: 'initial',
      paddingLeft: 'initial',
      paddingRight: 'initial',
    },
  }),
})

export const shadow = style({
  backgroundColor: 'rgba(0, 97, 255, 0.16)',
  top: '-20px',
  left: 10,
  right: 10,
  position: 'absolute',
  height: '100px',
  borderRadius: '50%',
  filter: 'blur(10px)',
  zIndex: -1,
})

export const dividerContainer = style({
  ...themeUtils.responsiveStyle({
    xs: {
      marginLeft: -theme.grid.gutter.desktop,
      marginRight: -theme.grid.gutter.desktop,
    },
    md: {
      marginLeft: 0,
      marginRight: 0,
    },
  }),
})
