import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const unopenedWrapper = style({
  backgroundColor: 'unset',
  ...themeUtils.responsiveStyle({
    sm: {
      backgroundColor: '#FBFBFC',
    },
  }),
})

export const line = style({
  fontSize: theme.typography.baseFontSize,
  borderBottom: `1px solid ${theme.color.blue100}`,
})

export const button = style({
  color: theme.color.blue400,
  fontSize: 16,
  fontWeight: theme.typography.regular,
  lineHeight: 1.5,
  textAlign: 'left',
  ':hover': {
    textDecoration: 'underline',
  },
  ':focus': {
    outline: 'none',
  },
})

export const unopened = style({
  fontWeight: theme.typography.semiBold,
})

export const sender = style({
  fontWeight: theme.typography.light,
  fontSize: 14,
  ...themeUtils.responsiveStyle({
    md: {
      fontWeight: theme.typography.regular,
      fontSize: theme.typography.baseFontSize,
    },
  }),
})

export const image = style({
  width: 30,
  height: 30,
  marginRight: theme.spacing[2],
})

export const icon = style({
  marginLeft: 6,
})

export const linkWrapper = style({
  backgroundColor: theme.color.blueberry100,
})
