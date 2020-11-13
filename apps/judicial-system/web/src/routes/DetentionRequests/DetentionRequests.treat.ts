import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const detentionRequestsContainer = style({
  display: 'grid',
  gridColumnGap: 24,
  gridTemplateColumns: 'repeat(12, 1fr)',
  gridTemplateRows: 'repeat(3, auto)',
  maxWidth: '1440px',
  margin: `${theme.spacing[12]}px auto`,
  padding: `0 ${theme.spacing[6]}px`,
})

export const logoContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  gridColumn: '1 / -1',
  marginBottom: theme.spacing[9],
})

export const detentionRequestsTable = style({
  gridRow: '2',
  gridColumn: '1 / -1',
})

export const detentionRequestsError = style({
  gridRow: '2',
  gridColumn: '1 / 5',
})

export const detentionRequestsTableRow = style({
  borderBottom: `1px solid ${theme.color.blue200}`,
})
