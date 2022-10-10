import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const modal = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  maxWidth: 888,
  margin: `${theme.spacing['3']} auto`,
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.16)',
  ...themeUtils.responsiveStyle({
    md: {
      margin: `${theme.spacing['6']}px auto`,
    },
  }),
})
