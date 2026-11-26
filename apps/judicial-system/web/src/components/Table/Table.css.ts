import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

// Lets the table scroll horizontally instead of overflowing the viewport
// once it gets wider than the available space (e.g. on smaller screens).
export const tableWrapper = style({
  width: '100%',
  overflowX: 'auto',
})

export const table = style({
  borderSpacing: 0,
  borderCollapse: 'collapse',

  // Needed for Safari.
  width: '100%',
})

// Column widths come from the header cells and the table's width, not from
// the content, so two tables with the same columns line up whatever rows each
// one holds. Below its minimum width the table scrolls in its wrapper rather
// than squeezing the columns.
export const fixedLayoutTable = style({
  tableLayout: 'fixed',
  width: '100%',
  minWidth: 1100,
})

// Body text longer than its column wraps between words. Header cells keep
// the `th` nowrap.
globalStyle(`${fixedLayoutTable} td`, {
  overflowWrap: 'break-word',
})

const menuTriggerSize = 34
const menuColumnWidth = 64

// The column of the row menu fits its trigger and no more.
export const fixedLayoutMenuColumn = style({
  boxSizing: 'border-box',
  width: menuColumnWidth,
})

// Scoped to the table so it outranks the cell padding set further down.
globalStyle(`${fixedLayoutTable} ${fixedLayoutMenuColumn}`, {
  paddingLeft: (menuColumnWidth - menuTriggerSize) / 2,
  paddingRight: (menuColumnWidth - menuTriggerSize) / 2,
})

// In a table whose rows fade in and out, the cells' vertical padding sits on
// the content inside them, so it closes with the row.
export const fadeRowsTable = style({})

globalStyle(`${fadeRowsTable} tbody td`, {
  paddingTop: 0,
  paddingBottom: 0,
})

export const fadingCellContent = style({
  paddingTop: theme.spacing[2],
  paddingBottom: theme.spacing[2],
})

export const thead = style({
  background: theme.color.blue100,
  textAlign: 'left',
})

export const thButton = style({
  outline: 'none',

  ':active': {
    color: theme.color.dark400,
  },

  selectors: {
    '&:focus-visible': {
      boxShadow: `0 0 0 ${theme.border.width.large}px ${theme.border.color.focus}`,
    },
  },
})

export const tableRowContainer = style({
  borderBottom: `1px solid ${theme.color.blue200}`,
  cursor: 'pointer',
})

export const th = style({
  padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
  whiteSpace: 'nowrap',
})

export const smallContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '34px',
  height: '34px',
  marginLeft: 'auto',
})

// The context menu trigger is the focusable element itself (the Ariakit
// MenuButton renders onto it), so it carries the icon-button affordance and
// the keyboard focus ring.
export const contextMenuButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '34px',
  height: '34px',
  marginLeft: 'auto',
  borderRadius: theme.border.radius.large,
  cursor: 'pointer',
  transition: 'background-color .2s',

  selectors: {
    // The open state of the context menu should look the same as hover
    '&:hover, &[aria-expanded="true"]': {
      backgroundColor: theme.color.blue200,
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 ${theme.border.width.large}px ${theme.border.color.focus}`,
    },
  },
})

globalStyle(`${table} td, th`, {
  borderBottomWidth: 1,
  borderBottomStyle: 'solid',
  borderBottomColor: theme.color.blue200,
  paddingLeft: theme.spacing[3],
  paddingRight: theme.spacing[3],
  paddingTop: theme.spacing[2],
  paddingBottom: theme.spacing[2],
  textAlign: 'left',
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

export const sortAsc = style({
  opacity: 1,
  transform: 'rotate(180deg)',
})

export const sortDes = style({
  opacity: 1,
  transform: 'rotate(0deg)',
})
