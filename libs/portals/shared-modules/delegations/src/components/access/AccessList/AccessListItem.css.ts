import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const headerContainer = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  columnGap: theme.spacing[1],
  ...themeUtils.responsiveStyle({
    lg: {
      display: 'initial',
      alignItems: 'initial',
      justifyContent: 'initial',
      columnGap: 'initial',
    },
  }),
})
