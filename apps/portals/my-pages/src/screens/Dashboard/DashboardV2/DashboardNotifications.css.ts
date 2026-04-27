import { theme } from '@island.is/island-ui/theme'
import { style, styleVariants } from '@vanilla-extract/css'

export const lock = style({
  position: 'absolute',
  zIndex: 1,
  top: theme.spacing[2],
  right: theme.spacing[3],
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

export const unreadDot = style({
  width: theme.spacing[1],
  height: theme.spacing[1],
  borderRadius: '50%',
  backgroundColor: theme.color.red400,
  flexShrink: 0,
})

export const accessDeniedImage = style({
  height: 180,
})

export const notificationSenderLogoWrapper = style({
  width: 40,
  height: 40,
  flexShrink: 0,
  borderRadius: '50%',
  backgroundColor: theme.color.blue100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const notificationLink = style({
  display: 'block',
  textDecoration: 'none',
})

export const notificationSenderLogoImage = style({
  width: 24,
  height: 24,
  objectFit: 'contain',
})
