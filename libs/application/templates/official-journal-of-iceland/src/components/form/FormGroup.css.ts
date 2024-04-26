import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const formGroup = style({
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.spacing[3],
})
