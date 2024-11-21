import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const breakdownRowContainer = style({
  display: 'grid',
  gridTemplateColumns: '180px 1fr',
  gap: theme.spacing[5],
})
