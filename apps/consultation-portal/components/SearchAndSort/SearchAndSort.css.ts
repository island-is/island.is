import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const label = style({
  display: 'block',
  width: '100%',
  color: theme.color.blue400,
  fontWeight: theme.typography.medium,
  fontSize: 12,
  lineHeight: 1.3333333333,
  transition: 'color 0.1s',
  marginBottom: 7,
  ...themeUtils.responsiveStyle({
    md: {
      lineHeight: 1.1428571429,
      fontSize: 14,
    },
  }),
})
