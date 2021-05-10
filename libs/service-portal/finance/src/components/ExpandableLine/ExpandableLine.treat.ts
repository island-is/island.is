import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const line = style({
  borderLeft: `2px solid ${theme.color.blue400}`,
  ...themeUtils.responsiveStyle({
    sm: {
      borderBottom: `1px solid ${theme.color.blue200}`,
    },
  }),
})
export const sideLine = style({
  borderLeft: `2px solid ${theme.color.transparent}`,
})