import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const selectWrapper = style({
  width: '100%',
  ...themeUtils.responsiveStyle({
    sm: {
      width: '50%',
    },
    lg: {
      width: '35%',
    },
  }),
})

export const tableHeading = style({
  boxShadow: `inset 0px -1px 0px ${theme.color.blue200}`,
})
