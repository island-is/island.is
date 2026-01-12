import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const roleRow = style({
  display: 'flex',
  gap: theme.spacing[2],
  marginBottom: theme.spacing[2],
})

export const roleColumn = style({
  flex: 1,
})

export const userFormContainer = style({
  padding: '80px 0 48px 0',
  background: theme.color.white,
})
