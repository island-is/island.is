import { style } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'

export const title = style({
  height: 34,
  fontWeight: 600,
  fontSize: 24,
  lineHeight: "34px",
  marginBottom: 14,
  ...themeUtils.responsiveStyle({
    sm: {
      fontSize: 24,
      lineHeight: 34 / 24,
    },
  }),
})
