import { themeUtils, theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const button = style({
  ...themeUtils.responsiveStyle({
    xs: {
      alignSelf: 'stretch',
      marginTop: theme.spacing[1],
    },
    sm: {
      alignSelf: 'stretch',
      marginTop: theme.spacing[1],
    },
    md: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      marginTop: 0,
    },
  }),
})

export const buttoncontainer = style({
  ...themeUtils.responsiveStyle({
    xs: {
      alignSelf: 'stretch',
      flexDirection: 'column',
    },
    sm: {
      alignSelf: 'stretch',
      flexDirection: 'column',
    },
    md: {
      alignSelf: 'stretch',
      flexDirection: 'row',
    },
  }),
})
