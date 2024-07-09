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

export const tableRowContainer = style({
  borderBottom: `1px solid ${theme.color.blue200}`,
  cursor: 'pointer',
  margin: `0 ${theme.spacing[2]}px`,
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
