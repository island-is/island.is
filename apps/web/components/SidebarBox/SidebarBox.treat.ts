import { style } from 'treat'
import { themeUtils, theme } from '@island.is/island-ui/theme'

export const container = style({
  backgroundColor: theme.color.purple100,
  margin: `0 -24px`,
  ...themeUtils.responsiveStyle({
    md: {
      margin: 0,
      borderRadius: theme.border.radius.large,
    },
  }),
})
