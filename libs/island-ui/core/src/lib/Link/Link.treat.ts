import { style, styleMap } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const link = style({
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'none',
  },
})

export const withUnderline = style({
  textDecoration: 'none',
  boxShadow: 'none',
  transition: 'color .2s, box-shadow .2s',
  paddingBottom: 4,
  ':hover': {
    boxShadow: `inset 0 -2px 0 0 currentColor`,
    textDecoration: 'none',
  },
})

export const colors = styleMap({
  blue400: {
    color: theme.color.blue400,
    ':hover': {
      color: theme.color.blueberry400,
    },
  },
  white: {
    color: theme.color.white,
    ':hover': {
      color: theme.color.white,
    },
  },
})
