import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const linkContainer = style({
  paddingBottom: 0,
  height: '39.5px',
  display: 'flex',
  alignItems: 'center',
  ...themeUtils.responsiveStyle({
    md: {
      alignSelf: 'flex-end',
      paddingTop: 0,
      height: '48px',
    },
  }),
})
