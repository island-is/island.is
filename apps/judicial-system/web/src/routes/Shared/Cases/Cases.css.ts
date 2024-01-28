import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const logoContainer = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginBottom: theme.spacing[5],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flexDirection: 'row',
    },
  },
})

export const filterContainer = style({
  maxWidth: '432px',
})

export const table = style({
  borderSpacing: 0,
  borderCollapse: 'collapse',
  overflow: 'hidden',

  // Needed for Safari.
  width: '100%',
})

export const infoContainer = style({
  marginBottom: theme.spacing[3],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      maxWidth: '50%',
    },
  },
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
  margin: `0 ${theme.spacing[2]}px`,
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

export const blockColumn = style({
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const th = style({
  padding: `${theme.spacing[2]}px 0`,

  selectors: {
    '&:first-child': {
      paddingLeft: theme.spacing[2],
    },
  },
})

export const td = style({
  padding: `${theme.spacing[2]}px 0`,
  selectors: {
    '&:first-child': {
      paddingLeft: theme.spacing[2],
    },
  },
})

export const deleteButtonWrapper = style({
  margin: '0 auto',
  padding: 10,
  width: 44,
  height: 44,
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
