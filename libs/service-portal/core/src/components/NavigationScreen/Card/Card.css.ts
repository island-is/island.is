import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const card = style({
  transition: 'border-color 200ms',
  ':hover': {
    borderColor: theme.color.blue300,
  },
})
