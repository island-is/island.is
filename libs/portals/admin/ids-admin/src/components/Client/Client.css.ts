import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const select = style({
  flexGrow: 1,

  ...themeUtils.responsiveStyle({
    sm: {
      maxWidth: 230,
      width: '100%',
      display: 'grid',
      alignItems: 'center',
    },
  }),
})
