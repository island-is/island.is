import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const wrapper = style({
  transition: 'border-color 200ms',
  ':hover': {
    borderColor: theme.color.blue300,
  },
})

export const link = style({
  color: theme.color.blue400,
  transition: 'color 200ms',
  ':hover': {
    color: theme.color.purple400,
    textDecoration: 'none',
  },
})
