import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  borderRadius: theme.border.radius.standard,
  border: `1px solid ${theme.color.blue200}`,
  padding: theme.spacing[2],
})
