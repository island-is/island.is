import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const linkContainer = style({
  display: 'flex',
  alignSelf: 'flex-start',
  marginBottom: 10,
  ...themeUtils.responsiveStyle({
    lg: {
      alignSelf: 'flex-end',
      marginBottom: 13.5,
    },
  }),
})
