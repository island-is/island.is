import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  border: `1px dashed ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,

  padding: `${theme.spacing[10]}px`,
  marginBottom: `${theme.spacing[10]}px`,
})
