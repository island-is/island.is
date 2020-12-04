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
  gridRow: '3',
  gridColumn: '1 / -1',

  // Needed for Safari.
  width: '100%',
})

export const detentionRequestsError = style({
  gridRow: '2',
  gridColumn: '1 / 5',
})

export const detentionRequestsTableRow = style({
  borderBottom: `1px solid ${theme.color.blue200}`,
  cursor: 'pointer',
})

export const thButton = style({
  ':active': {
    color: theme.color.dark400,
  },
})

export const sortIcon = style({
  opacity: 0,
  transition: 'opacity .2s ease-in-out, transform .2s ease-in-out .1s',
})

export const sortCreatedAsc = style({
  opacity: 1,
  transform: 'rotate(0deg)',
})

export const sortCreatedDes = style({
  opacity: 1,
  transform: 'rotate(180deg)',
})

export const sortAccusedNameAsc = style({
  opacity: 1,
  transform: 'rotate(0deg)',
})

export const sortAccusedNameDes = style({
  opacity: 1,
  transform: 'rotate(180deg)',
})
