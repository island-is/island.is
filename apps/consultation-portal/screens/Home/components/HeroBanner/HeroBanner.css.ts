import { themeUtils, theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const rowAlign = style({
  alignItems: 'flex-end',
  paddingBottom: theme.spacing[6],
  paddingTop: theme.spacing[6],
  ...themeUtils.responsiveStyle({
    lg: {
      paddingBottom: theme.spacing[7],
    },
  }),
})

export const alignTiles = style({
  ...themeUtils.responsiveStyle({
    lg: {
      position: 'absolute',
      bottom: 0,
      right: 0,
    },
    xl: {
      position: 'absolute',
      bottom: 0,
      right: 0,
    },
  }),
})

export const heroImage = style({
  position: 'relative',
  display: 'block',
  margin: '0 auto',
  height: 'auto',
  width: '100%',
  maxWidth: 660,
  paddingBottom: theme.spacing[3],
  marginBottom: '-1.8%',
  ...themeUtils.responsiveStyle({
    lg: {
      paddingBottom: 'unset',
    },
    xl: {
      paddingBottom: 'unset',
    },
  }),
})
