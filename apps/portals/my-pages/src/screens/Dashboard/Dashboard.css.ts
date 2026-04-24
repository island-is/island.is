import { theme, themeUtils } from '@island.is/island-ui/theme'
import { styleVariants } from '@vanilla-extract/css'
import { style, globalStyle } from '@vanilla-extract/css'

export const badge = styleVariants({
  active: {
    position: 'absolute',
    top: 34,
    left: 67,
    height: theme.spacing[1],
    width: theme.spacing[1],
    borderRadius: '50%',
    backgroundColor: theme.color.red400,
    ...themeUtils.responsiveStyle({
      md: {
        left: 67,
      },
    }),
  },
  inactive: {
    display: 'none',
  },
})

export const lock = style({
  position: 'absolute',
  zIndex: 1,
  top: theme.spacing[2],
  right: theme.spacing[3],
})

export const mailIcon = style({
  minWidth: 30,
  width: 40,
  height: 40,
  ...themeUtils.responsiveStyle({
    md: {
      minWidth: 40,
    },
  }),
})

export const mailLink = style({
  display: 'inline-block',
})

export const svgOutline = style({})

globalStyle(`${svgOutline} svg path`, {
  stroke: theme.color.blue400,
})

export const unreadDot = style({
  width: theme.spacing[1],
  height: theme.spacing[1],
  borderRadius: '50%',
  backgroundColor: theme.color.red400,
  flexShrink: 0,
})

export const notificationBadge = styleVariants({
  active: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: theme.spacing[1],
    width: theme.spacing[1],
    borderRadius: '50%',
    backgroundColor: theme.color.red400,
    transform: 'translate(-40%, -10%)',
  },
  inactive: {
    display: 'none',
  },
})

export const featuredCardIcon = style({
  minWidth: 24,
  width: 32,
  height: 32,
  flexShrink: 0,
})

globalStyle(`${featuredCardIcon} svg`, {
  height: '100%',
})
