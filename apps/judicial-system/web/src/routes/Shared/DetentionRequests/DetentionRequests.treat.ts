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

export const thead = style({
  background: theme.color.blue100,
  boxShadow: `inset 0px -1px 0px ${theme.color.blue200}`,
})

export const deleteButtonContainer = style({
  display: 'flex',
  alignItems: 'center',
  width: 0,
  overflow: 'hidden',
  visibility: 'hidden',
  transition: 'all .5s ease-in-out',

  selectors: {
    '&.open': {
      width: '150px',
      visibility: 'visible',
    },
  },
})

export const thButton = style({
  outline: 'none',

  ':active': {
    color: theme.color.dark400,
  },
})

export const tableRowContainer = style({
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  minWidth: '100%',
  borderBottom: `1px solid ${theme.color.blue200}`,
  cursor: 'pointer',
  float: 'right',
  transition: 'all .5s ease-in-out',

  selectors: {
    '&.isDeleting': {
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
  width: 'auto',
})

export const td = style({
  display: 'flex',
  flex: 1,
  padding: theme.spacing[3],
  width: 'auto',

  selectors: {
    '&.secondLast': {
      flex: 0,
      justifyContent: 'flex-end',
      marginLeft: 'auto',
      height: '100%',
      padding: 0,
    },
    '&.flexDirectionCol': {
      flexDirection: 'column',
    },
  },
})

export const deleteButton = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100px',
  height: '100px',
  borderRadius: theme.border.radius.large,
  outline: 'none',

  selectors: {
    '&:focus': {
      boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
    },
    '&:hover': {
      backgroundColor: theme.color.transparent,
      boxShadow: `inset 0 0 0 2px ${theme.color.blueberry400}`,
      color: theme.color.blueberry400,
    },
    '&:focus:active': {
      backgroundColor: theme.color.transparent,
      boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
    },
  },
})

export const deleteButtonText = style({
  whiteSpace: 'nowrap',
})

export const sortIcon = style({
  opacity: 0.4,
  transition: 'opacity .2s ease-in-out',

  selectors: {
    [`${thButton}:hover &`]: {
      opacity: 1,
    },
  },
})

export const sortCreatedAsc = style({
  opacity: 1,
  transform: 'rotate(180deg)',
})

export const sortCreatedDes = style({
  opacity: 1,
  transform: 'rotate(0deg)',
})

export const sortAccusedNameAsc = style({
  opacity: 1,
  transform: 'rotate(0deg)',
})

export const sortAccusedNameDes = style({
  opacity: 1,
  transform: 'rotate(180deg)',
})
