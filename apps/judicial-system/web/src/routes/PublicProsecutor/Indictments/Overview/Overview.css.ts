import { style } from '@vanilla-extract/css'

import { spacing } from '@island.is/island-ui/theme'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[5],
})
