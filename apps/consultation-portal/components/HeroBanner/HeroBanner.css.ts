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
      // width: '100%',
      right: 0,
    },
  }),
})

export const bg = style({
  display: 'block',
  position: 'relative',
  maxHeight: '317px',
  maxWidth: '317px',
  // top: 16,
  width: '100%',
})
