import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const sidebar = style({
  minWidth: 250,
  height: '100%',
  ...themeUtils.responsiveStyle({
    xl: {
      width: 300,
    },
  }),
})

export const subNavItem = style({
  display: 'block',
  fontSize: 15,
  paddingBottom: theme.spacing['1'],
})
