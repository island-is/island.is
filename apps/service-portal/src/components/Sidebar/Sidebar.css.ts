import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const sidebar = style({
  height: '100%',
  minWidth: 250,
  marginBottom: theme.spacing['10'],
  ...themeUtils.responsiveStyle({
    lg: {
      width: 306,
    },
  }),
})

export const subnav = style({
  marginLeft: 12,
  paddingLeft: 26,
  borderLeft: `1px solid ${theme.color.blue200}`,
})
