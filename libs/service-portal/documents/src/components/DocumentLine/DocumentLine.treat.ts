import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const line = style({
  ...themeUtils.responsiveStyle({
    sm: {
      borderBottom: `1px solid ${theme.color.blue200}`,
    },
  }),
})

export const link = style({
  color: theme.color.blue400,
  fontWeight: theme.typography.semiBold,
  lineHeight: theme.typography.baseLineHeight,
  textAlign: 'left',
  ...themeUtils.responsiveStyle({
    sm: {
      fontWeight: theme.typography.regular,
    },
  }),
  ':hover': {
    textDecoration: 'underline',
  },
})

export const date = style({
  fontWeight: theme.typography.regular,
  fontSize: 12,
  color: theme.color.dark300,
  ...themeUtils.responsiveStyle({
    sm: {
      paddingBottom: 0,
      color: theme.color.dark400,
      fontWeight: theme.typography.light,
      fontSize: 16,
    },
    md: {
      fontSize: 18,
    },
  }),
})
