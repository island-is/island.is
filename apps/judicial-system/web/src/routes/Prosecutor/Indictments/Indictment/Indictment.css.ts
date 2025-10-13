import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const demandsGrid = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[3],
})
