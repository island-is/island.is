import { style } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'

export const districtsTitle = style({
  fontWeight: 600,
  fontSize: 20,
  lineHeight: 28 / 20,
  ...themeUtils.responsiveStyle({
    sm: {
      fontSize: 24,
      lineHeight: 34 / 24,
    },
  }),
})

export const districtsList = style({
  columnGap: 30,
  ...themeUtils.responsiveStyle({
    xs: {
      columnCount: 1,
      marginTop: 40,
      marginBottom: 40,
    },
    md: {
      columnCount: 2,
      marginTop: 75,
    },
    lg: { columnCount: 3 },
    xl: { columnCount: 3 },
  }),
})

export const districtsListItem = style({
  marginBottom: 32,
})
