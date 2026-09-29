import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const containerGrid = style({
  display: 'grid',
  // minmax(0, 1fr) so tracks can shrink below content min-width; unbroken
  // filenames in Önnur skjöl must not blow out the court-record column.
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: theme.spacing[5],
})

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: theme.spacing[2],
  width: '100%',
})

export const unfiledDocuments = style({
  minWidth: 0,
  maxWidth: '100%',
  overflow: 'hidden',
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

export const alertContainer = style({
  width: '100%',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      width: '70%',
    },
  },
})
