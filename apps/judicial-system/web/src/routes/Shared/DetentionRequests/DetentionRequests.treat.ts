import { style, styleMap } from 'treat'
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
  display: 'flex',
  flex: 1,
  borderBottom: `1px solid ${theme.color.blue200}`,
  cursor: 'pointer',
})

export const thead = style({
  display: 'flex',
  background: theme.color.blue100,
  boxShadow: `inset 0px -1px 0px ${theme.color.blue200}`,
})

export const deleteButtonContainer = style({
  boxShadow: `inset 0px -1px 0px ${theme.color.blue200}`,
})

export const thButton = style({
  ':active': {
    color: theme.color.dark400,
  },
})

export const tableRowContainer = style({
  minWidth: '100%',
  transition: 'all .2s ease-in-out',
  float: 'right',

  selectors: {
    ['&.isDeleting']: {
      minWidth: 'calc(100% + 100px)',
    },
  },
})

export const tr = style({
  display: 'flex',
  flex: 1,
})

export const th = style({
  display: 'flex',
  flex: 1,
  padding: '12px 24px',
})

export const td = style({
  display: 'flex',
  flex: 1,
  padding: theme.spacing[3],
})

export const deleteButton = styleMap({
  closed: {
    width: 0,
    overflow: 'hidden',
    transition: 'all .2s ease-in-out',
  },
  open: {
    width: '100px',
    transition: 'all .2s ease-in-out',
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
