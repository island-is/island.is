import { spacing } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[5],
})
