import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const addCourtDocumentContainer = style({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  columnGap: theme.spacing[2],
  marginBottom: theme.spacing[3],
})
