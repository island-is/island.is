import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const addCourtDocumentContainer = style({
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  columnGap: theme.spacing[2],
  marginBottom: theme.spacing[2],
})

export const additionalCordDocumentContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  borderTop: `1px solid ${theme.color.blue200}`,
  padding: `${theme.spacing[2]}px 0`,
})
