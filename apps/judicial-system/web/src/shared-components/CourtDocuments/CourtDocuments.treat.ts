import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const addCourtDocumentContainer = style({
  display: 'grid',
  gridTemplateColumns: '1fr 208px',
  columnGap: theme.spacing[2],
  marginBottom: theme.spacing[3],
})

export const additionalCourtDocumentContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  borderTop: `1px solid ${theme.color.blue200}`,
  padding: `${theme.spacing[2]}px 0`,
})
