import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const mainContent = style({
  border: `1px solid ${theme.border.color.blue200}`,
  borderRadius: theme.border.radius.standard,
  width: '100%',
  height: '100%',
  marginTop: '50px',
})
