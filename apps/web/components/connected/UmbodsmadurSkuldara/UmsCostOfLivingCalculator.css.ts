import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const readOnlyValues = style({
  padding: '8px 16px 8px 8px',
  boxShadow: `inset 0 0 0 1px ${theme.color.blue200}`,
  borderRadius: '8px',
})

export const total = style({
  padding: '8px 16px 8px 8px',
  boxShadow: `inset 0 0 0 1px ${theme.color.blue200}`,
  borderRadius: '8px',
  background: 'white',
})
