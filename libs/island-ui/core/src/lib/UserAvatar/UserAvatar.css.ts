import { style, styleVariants } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const avatarSize = styleVariants({
  default: {
    width: 40,
    height: 40,
  },
  small: {
    width: 28,
    height: 28,
  },
  medium: {
    width: 32,
    height: 32,
  },
})

export const avatarColor = styleVariants({
  blue: {
    backgroundColor: theme.color.blue100,
    color: theme.color.blue400,
  },
  darkBlue: {
    backgroundColor: theme.color.blue200,
    color: theme.color.blue400,
  },
  purple: {
    backgroundColor: theme.color.purple100,
    color: theme.color.purple400,
  },
})

export const initials = style({
  fontWeight: 600,
})

export const initialsDelegation = style({
  color: theme.color.white,
})

export const initialsSize = styleVariants({
  default: {
    fontSize: 18,
  },
  small: {
    fontSize: 14,
  },
  medium: {
    fontSize: 14,
  },
})
