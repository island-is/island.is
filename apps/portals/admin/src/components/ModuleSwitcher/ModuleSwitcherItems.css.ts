import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const link = style({
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'none',
  },
})

export const itemHover = style({
  ':hover': {
    background: theme.color.blue100,
    borderRadius: theme.border.radius.default,
  },
})
