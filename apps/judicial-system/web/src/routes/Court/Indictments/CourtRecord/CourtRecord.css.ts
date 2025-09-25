import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const containerGrid = style({
  display: 'grid',
  gap: theme.spacing[5],
  marginBottom: theme.spacing[3],
})

export const grid = style({
  display: 'grid',
  gap: theme.spacing[2],
  width: '100%',
})

export const courtEndTimeContainer = style({
  display: 'flex',
  gap: theme.spacing[2],
  flexGrow: 1,
})

export const button = style({
  display: 'flex',
  whiteSpace: 'nowrap',
})

export const fullWidth = style({
  width: '100%',
})

export const twoColGrid = style({
  display: 'grid',
  gap: theme.spacing[2],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
})

export const reorderGroup = style({
  marginTop: theme.spacing[2],
  gap: theme.spacing[2],

  selectors: {
    '&:not(:has([data-reorder-item]))': {
      marginTop: 0,
    },
  },
})
