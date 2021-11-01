import { keyframes, style } from '@vanilla-extract/css'
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

export const line = style({
  ...themeUtils.responsiveStyle({
    sm: {
      borderBottom: `1px solid ${theme.color.blue200}`,
    },
  }),
})

export const button = style({
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
  ':focus': {
    outline: 'none',
  },
})

export const sender = style({
  fontWeight: theme.typography.regular,
  fontSize: 12,
  ...themeUtils.responsiveStyle({
    sm: {
      fontWeight: theme.typography.light,
      fontSize: 18,
    },
  }),
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
