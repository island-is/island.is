import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const item = style({
  fontSize: 14,
  fontWeight: theme.typography.semiBold,
  color: theme.color.dark400,
  ...themeUtils.responsiveStyle({
    lg: {
      fontSize: 16,
    },
  }),
})

export const title = style({
  display: 'flex',
  alignItems: 'center',
})
