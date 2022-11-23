import { themeUtils, theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  background: theme.color.white,
})

export const shadow = style({
  backgroundImage: `linear-gradient(to bottom, rgba(0, 97, 255, 0.16), rgba(255,255,255, 0.05))`,
  top: '-15px',
  left: '3%',
  right: '3%',
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
