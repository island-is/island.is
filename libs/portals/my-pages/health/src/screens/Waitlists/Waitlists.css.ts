import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const link = style({
  color: theme.color.blue400,
  textDecoration: 'underline',
  cursor: 'pointer',
})
