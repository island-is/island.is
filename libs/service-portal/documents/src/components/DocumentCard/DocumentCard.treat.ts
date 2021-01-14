import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const modalButtonWrapper = style({
  ...themeUtils.responsiveStyle({
    sm: {
      width: '100%',
    },
    lg: {
      width: 'fit-content',
    },
  }),
})

export const documentLine = style({
  borderBottom: `1px solid ${theme.color.blue200}`,
})

export const button = style({
  color: theme.color.blue400,
  ':hover': {
    textDecoration: 'underline',
  },
})
