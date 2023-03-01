import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const logo = style({
  marginRight: theme.spacing[2],
  width: theme.spacing[3],
  height: theme.spacing[3],
  objectFit: 'contain',
})
