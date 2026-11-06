import { theme, themeUtils, zIndex } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const footer = style(
  themeUtils.responsiveStyle({
    xs: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: zIndex.aboveHeader,
      backgroundColor: theme.color.white,
      boxShadow: theme.shadows.subtle,
      paddingLeft: theme.spacing[2],
      paddingRight: theme.spacing[2],
      paddingTop: theme.spacing[2],
      paddingBottom: theme.spacing[2],
    },
    sm: {
      position: 'static',
      backgroundColor: 'transparent',
      boxShadow: 'none',
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      marginTop: theme.spacing[4],
    },
  }),
)
