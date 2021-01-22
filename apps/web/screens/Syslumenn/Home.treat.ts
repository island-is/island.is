import { style } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'

export const intro = style({
  fontWeight: 300,
  fontSize: 20,
  lineHeight: 28 / 20,
  ...themeUtils.responsiveStyle({
    sm: {
      fontSize: 24,
      lineHeight: 34 / 24,
    },
  }),
})

export const newsBg = style({
  background: '#F8F5FA',
})
