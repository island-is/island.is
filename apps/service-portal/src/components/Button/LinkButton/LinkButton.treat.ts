import { style } from 'treat'
import { theme } from '@island.is/island-ui/core'

export const wrapper = style({
  transition: 'color 200ms',
  color: theme.color.blue400,
  ':hover': {
    color: theme.color.blueberry400,
  },
})

export const link = style({
  ':hover': {
    textDecoration: 'none',
  },
})

export const active = style({
  fontWeight: 600,
})
