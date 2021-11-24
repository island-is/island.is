import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const wrapper = style({
  transition: 'color 200ms',
  ':hover': {
    textDecoration: 'none',
    color: theme.color.blue400,
  },
})

export const link = style({
  transition: 'color 200ms',
  ':hover': {
    textDecoration: 'none',
    color: theme.color.blue400,
  },
})

export const active = style({
  fontWeight: 600,
})
