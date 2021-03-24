import { theme } from '@island.is/island-ui/core'
import { style } from 'treat'

export const infoBoxContainer = style({
  maxWidth: '432px',
  padding: theme.spacing[2],
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,
  background: theme.color.blue100,
})
