import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const img = style({
  width: 50,
  height: 50,
  ...themeUtils.responsiveStyle({
    sm: {
      width: 76,
      height: 76,
    },
  }),
})

export const imgText = style({
  color: theme.color.blue400,
  fontWeight: theme.typography.headingsFontWeight,
  fontSize: 20,
  ...themeUtils.responsiveStyle({
    sm: {
      fontSize: 24,
    },
  }),
})
