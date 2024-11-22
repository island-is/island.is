import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const caseDateContainer = style({
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.default,
  padding: `${theme.spacing[3]}px`,
})
