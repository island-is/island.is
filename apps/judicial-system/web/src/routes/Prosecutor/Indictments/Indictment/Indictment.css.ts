import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const demandsGrid = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[3],
})
