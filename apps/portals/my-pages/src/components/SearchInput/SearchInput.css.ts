import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const item = style({
  display: 'block',
  background: theme.color.blue100,
  padding: `${theme.spacing[1]}px ${theme.spacing[3]}px`,
})
