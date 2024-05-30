import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const wrapper = style({
  padding: theme.spacing[3],
  borderRadius: theme.border.radius.large,
  border: `1px solid ${theme.color.blue200}`,
  backgroundColor: theme.color.white,
})
