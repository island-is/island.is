import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const searchBox = style({
  outline: 'none',
  padding: `4px 0 4px 8px`,
  fontSize: '16px',
  fontWeight: theme.typography.light,
  backgroundColor: theme.color.blue100,
  border: 0,
  color: theme.color.black,

  ...themeUtils.responsiveStyle({
    md: {
      fontSize: '18px',
      padding: `15px 0 15px 24px`,
    },
  }),
})
