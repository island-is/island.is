import { keyframes, style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const container = style({
  margin: 0,
  width: '100%',

  ...themeUtils.responsiveStyle({
    xs: {
      height: '100dvh',
      justifyContent: 'initial',
    },
    sm: {
      maxWidth: '430px',
      width: '430px',
      height: 'initial',
    },
  }),
})

export const containerInner = style({
  maxWidth: theme.contentWidth.medium,
  margin: '0 auto',
})

export const fadeInKeyFrame = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})

export const fadeIn = style({
  animationName: fadeInKeyFrame,
  animationDuration: '300ms',
})

export const cardContainer = style({
  position: 'relative',
  overflow: 'hidden',

  ...themeUtils.responsiveStyle({
    xs: {
      border: 'none',
    },
    sm: {
      border: `${theme.border.width.standard}px ${theme.border.style.solid} ${theme.border.color.standard}`,
      borderRadius: theme.border.radius.large,
    },
  }),
})

const logoSize = 40
const logoOffset = logoSize / 2

export const logo = style({
  position: 'absolute',
  top: `-${logoOffset}px`,
  left: `calc(50% - ${logoOffset}px)`,
  background: theme.color.white,
  width: `${logoSize}px`,
})

export const footer = style({
  paddingBottom: theme.spacing[2],
  paddingRight: theme.spacing[3],
  paddingLeft: theme.spacing[3],
  marginTop: theme.spacing[2],
  ...themeUtils.responsiveStyle({
    xs: {
      paddingRight: 0,
      paddingLeft: 0,
      marginTop: 0,
    },
  }),
})

export const linkSeparator = style({
  width: 1,
  backgroundColor: theme.color.blue200,
})

export const link = style({
  fontWeight: theme.typography.semiBold,
  fontSize: 16,
  color: theme.color.blue400,
})
