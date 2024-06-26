import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const selected = style({
  cursor: 'pointer',
  fontWeight: 'bolder',
  textDecoration: 'underline',
  color: theme.color.blue400,
})

export const notSelected = style({
  cursor: 'pointer',
  ':hover': {
    fontWeight: 'bolder',
    textDecoration: 'underline',
  },
})
