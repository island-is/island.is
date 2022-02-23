import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const paddingForButton = style({
  paddingBottom: '2px',
})

export const tablePadding = style({
  paddingRight: theme.spacing[7],
  paddingTop: theme.spacing[2],
  paddingBottom: theme.spacing[2],
})

export const link = style({
  transition: 'background-color ease 250ms',
  borderRadius: theme.spacing[1],
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.purple100,
    },
  },
})

export const rowContent = style({
  display: 'flex',
  maxWidth: '224px',
  overflow: 'hidden',
})

export const firstChildPadding = style({
  paddingLeft: theme.spacing[2],
})

export const smallTableWrapper = style({
  gridColumn: 'span 6',
})

export const bigTableWrapper = style({
  gridColumn: '1 / -1',
})

export const wrapper = style({
  paddingBottom: theme.spacing[6],
  marginBottom: theme.spacing[6],
  overflowX: 'auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridTemplateColumns: 'repeat(8, 1fr)',
      columnGap: theme.spacing[3],
    },
  },
})

export const tableContainer = style({
  marginBottom: theme.spacing[3],
  marginRight: -theme.spacing[2],
  marginLeft: -theme.spacing[2],
  whiteSpace: 'nowrap',
})

export const tableBody = style({
  selectors: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
})
