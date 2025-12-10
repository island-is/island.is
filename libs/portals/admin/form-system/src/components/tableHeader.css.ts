import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const header = style({
  padding: '10px 0 10px 0',
  backgroundColor: theme.color.blue100,
  borderBottom: `1px solid ${theme.border.color.blue200}`,
})
