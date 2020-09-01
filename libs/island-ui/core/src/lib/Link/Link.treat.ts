import { style, styleMap } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const link = style({
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'none',
  },
})

export const colors = styleMap({
  blue400: {
    color: theme.color.blue400,
    ':hover': {
      color: theme.color.blue400,
    },
  },
  white: {
    color: theme.color.white,
    ':hover': {
      color: theme.color.white,
    },
  },
})
