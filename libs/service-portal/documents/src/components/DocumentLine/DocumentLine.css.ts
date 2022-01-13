import { keyframes, style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const unopenedWrapper = style({
  backgroundColor: 'unset',
  ...themeUtils.responsiveStyle({
    sm: {
      backgroundColor: '#FBFBFC',
    },
  }),
})

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

export const line = style({
  fontSize: theme.typography.baseFontSize,
  borderBottom: `1px solid ${theme.color.blue100}`,
  ...themeUtils.responsiveStyle({
    sm: {},
  }),
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

export const date = style({
  ...themeUtils.responsiveStyle({
    sm: {
      paddingBottom: 0,
      color: theme.color.dark400,
      fontWeight: theme.typography.light,
      fontSize: 16,
    },
  }),
})

export const isLoadingContainer = style({
  opacity: 0.85,
  animationName: keyframes({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 0.85,
    },
  }),
  animationTimingFunction: 'ease-out',
  animationDuration: '0.25s',
})

export const image = style({
  width: 30,
  height: 30,
  marginRight: theme.spacing[2],
})
