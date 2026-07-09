import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const lock = style({
  position: 'absolute',
  zIndex: 1,
  top: theme.spacing[2],
  right: theme.spacing[3],
})

export const unreadRow = style({
  backgroundColor: theme.color.blueberry100,
})

export const stateImage = style({
  height: 180,
})

export const notificationSenderLogoImage = style({
  height: 'auto',
  width: 'auto',
  display: 'flex',
  maxHeight: 28,
  maxWidth: 28,
})

export const avatarContainer = style({
  minWidth: 48,
  minHeight: 48,
  maxHeight: 48,
  maxWidth: 48,
  transition: 'background-color .25s',
})

export const notificationLink = style({
  display: 'block',
  textDecoration: 'none',
})

export const notificationRowMobileFull = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md - 1}px)`]: {
      marginLeft: -theme.spacing[4],
      marginRight: -theme.spacing[4],
    },
  },
})
