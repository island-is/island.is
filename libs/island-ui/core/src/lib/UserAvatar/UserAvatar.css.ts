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
})

export const initials = style({
  color: theme.color.blue400,
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
})
