import { style } from 'treat'
import { theme } from '../../utils/theme'

export const tag = style({
  marginLeft: 'auto',
})

export const container = style({
  borderWidth: 1,
  borderColor: theme.color.transparent,
  transition: 'border-color 150ms ease',
  ':hover': {
    borderColor: theme.color.blue400,
  },
})

export const focused = style({
  ':hover': {
    borderColor: theme.color.transparent,
  },
})
