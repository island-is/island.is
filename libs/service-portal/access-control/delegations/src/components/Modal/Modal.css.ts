import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const modal = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  maxWidth: 888,
  margin: `${theme.spacing['3']} auto`,
  ...themeUtils.responsiveStyle({
    md: {
      margin: `${theme.spacing['6']}px auto`,
    },
  }),
})
