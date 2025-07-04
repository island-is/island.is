import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const subpoenaTypeGrid = style({
  display: 'grid',
  gap: theme.spacing[2],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
})

export const pdfButtonGrid = style({
  display: 'grid',
  gap: theme.spacing[2],
  justifyContent: 'left',
})
