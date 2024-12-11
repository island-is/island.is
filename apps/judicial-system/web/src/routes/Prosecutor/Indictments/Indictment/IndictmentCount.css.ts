import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const indictmentSubtypesContainter = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing[1],
  marginBottom: theme.spacing[2],
})

export const indictmentSubtypesItem = style({
  flex: `1 1 calc(50% - ${theme.spacing[1]}px)`,
  whiteSpace: 'nowrap',
})
