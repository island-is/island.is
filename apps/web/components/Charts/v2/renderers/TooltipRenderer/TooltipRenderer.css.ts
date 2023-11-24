import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const list = style({
  backgroundColor: theme.color.white,
  border: `${theme.border.width.standard}px solid ${theme.color.blue100}`,
  padding: theme.spacing[1],
  borderRadius: theme.border.radius.standard,
})
