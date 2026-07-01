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

  ':hover': {
    backgroundColor: theme.color.blue200,
  },

  selectors: {
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
