import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const tag = style({
  marginBottom: theme.spacing[1],
  ...themeUtils.responsiveStyle({
    md: {
      marginBottom: 'unset',
      alignSelf: 'flex-start',
    },
  }),
})

export const avatar = style({
  display: 'none',
  ...themeUtils.responsiveStyle({
    sm: {
      display: 'flex',
      width: 66,
      height: 66,
    },
  }),
})

export const button = style({
  ...themeUtils.responsiveStyle({
    sm: {
      alignSelf: 'stretch',
      alignItems: 'flex-end',
    },
  }),
})
