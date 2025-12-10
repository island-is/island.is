import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const icon = style({
  display: 'flex',
  padding: 5,
})

export const menuItemHover = style({
  ':hover': {
    color: theme.color.blue400,
  },
})

export const menuItemDestructive = style({
  ':hover': {
    color: theme.color.roseTinted400,
  },
})
