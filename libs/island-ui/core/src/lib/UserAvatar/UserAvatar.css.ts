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
  isDelegation: {
    backgroundColor: theme.color.blue400,
    color: theme.color.white,
  },
  blue: {
    backgroundColor: theme.color.blue100,
    color: theme.color.blue400,
  },
  darkBlue: {
    backgroundColor: theme.color.blue200,
    color: theme.color.blue400,
  },
  darkPurple: {
    backgroundColor: theme.color.purple200,
    color: theme.color.purple400,
  },
  purple: {
    backgroundColor: theme.color.purple100,
    color: theme.color.purple400,
  },
  white: {
    backgroundColor: theme.color.white,
    color: theme.color.blue400,
  },
})

export const initials = style({
  fontWeight: 600,
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
