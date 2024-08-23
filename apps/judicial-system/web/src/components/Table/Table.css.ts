import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

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
})

export const tableRowContainer = style({
  borderBottom: `1px solid ${theme.color.blue200}`,
  cursor: 'pointer',
})

export const th = style({
  padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
})

export const largeColumn = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      // The width needed to make sure a 33 character name doesn't wrap
      maxWidth: 334,
      whiteSpace: 'nowrap',
    },
  },
})

export const smallContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '34px',
  height: '34px',
  marginLeft: 'auto',
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

export const row = style({
  cursor: 'pointer',
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

export const loadingContainer = style({
  minWidth: '67px',
})
