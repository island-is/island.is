import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  position: 'absolute',
  top: 20,
  left: 20,
  padding: 10,
  background: theme.color.dark400,
  color: theme.color.white,
  borderRadius: theme.border.radius.large,
  opacity: 0.8,
  borderWidth: 1,
  outline: 0,
  textDecoration: 'none',
  borderStyle: 'solid',
  borderColor: theme.color.blue200,
  overflow: 'hidden',
  zIndex: 1,
  '@media': {
    [`screen and (max-width: 991px)`]: {
      borderRadius: 0,
      border: 'none',
    },
  },
  transition: 'transform 150ms ease',
  transform: `translateY(calc(-100% - 20px))`,
  ':focus': {
    transform: `translateY(0)`,
  },
})
