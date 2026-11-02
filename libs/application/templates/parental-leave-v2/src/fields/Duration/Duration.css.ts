import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const errorMessage = style({
  color: theme.color.red600,
  fontWeight: theme.typography.medium,
  fontSize: 14,
  marginTop: theme.spacing[1],
})
