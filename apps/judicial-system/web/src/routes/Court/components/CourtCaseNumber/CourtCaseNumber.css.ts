import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const createCourtCaseContainer = style({
  display: 'flex',
  flexDirection: 'column-reverse',
  gap: theme.spacing[1],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)  `]: {
      flexDirection: 'row',
      gap: theme.spacing[2],
    },
  },
})

export const createCourtCaseButton = style({
  display: 'flex',
  maxHeight: theme.spacing[8],
})

export const createCourtCaseInput = style({
  flex: 1,
})
