import { themeUtils, theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

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

export const shadow = recipe({
  base: {
    background:
      'linear-gradient(270deg, rgba(0, 97, 255, 0) 0%, rgba(0, 97, 255, 0.16) 50%, rgba(0, 97, 255, 0) 100%);',
    top: '-4px',
    left: 0,
    right: 0,
    position: 'absolute',
    height: '30px',
    filter: 'blur(30px)',
    zIndex: -1,
    pointerEvents: 'none',
    transition: 'opacity 0.3s ease',
  },
  variants: {
    showShadow: {
      true: {
        opacity: 1,
      },
      false: {
        opacity: 0,
      },
    },
  },
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
