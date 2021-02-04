import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const districtsList = style({
  columnGap: 30,
  ...themeUtils.responsiveStyle({
    xs: {
      columnCount: 1,
      marginTop: theme.spacing[5],
      marginBottom: theme.spacing[5],
    },
    md: {
      columnCount: 2,
      marginTop: theme.spacing[9],
    },
    lg: { columnCount: 3 },
    xl: { columnCount: 3 },
  }),
})

export const districtsListItem = style({
  marginBottom: theme.spacing[4],
})
