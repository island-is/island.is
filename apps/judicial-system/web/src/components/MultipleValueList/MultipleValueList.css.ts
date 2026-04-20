import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'grid',
  rowGap: theme.spacing[2],
})

export const addCourtDocumentContainer = style({
  display: 'grid',
  rowGap: theme.spacing[2],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      gridTemplateColumns: '1fr auto',
      columnGap: theme.spacing[2],
    },
  },
})
