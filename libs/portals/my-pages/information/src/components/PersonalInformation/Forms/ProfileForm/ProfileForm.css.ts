import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const link = style({
  transition: 'color 200ms',
  color: theme.color.blue400,
  textDecoration: 'underline',
  ':hover': {
    color: theme.color.blueberry400,
  },
})
