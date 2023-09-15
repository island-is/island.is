import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  overflowY: 'auto',
  overflowX: 'hidden',
  width: '100%',
  height: '100%',
  background: theme.color.white,
  ...themeUtils.responsiveStyle({
    lg: {
      display: 'flex',
    },
  }),
})

export const mainContainer = style({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  ...themeUtils.responsiveStyle({
    lg: {
      maxWidth: 829,
    },
  }),
})
