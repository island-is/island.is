import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

// The frame a confirm modal previews a document in, and its padding while
// the document is still loading.
export const ruling = style({
  display: 'flex',
  justifyContent: 'center',
  border: `1px solid ${theme.color.blue200}`,
  width: '100%',
  height: '330px',
  overflow: 'auto',
  marginBottom: theme.spacing[5],
  marginTop: -theme.spacing[1],
})

export const loading = style({
  paddingTop: '230px',
})
