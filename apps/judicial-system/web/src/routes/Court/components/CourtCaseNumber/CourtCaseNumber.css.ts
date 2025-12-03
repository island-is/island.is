import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const createCourtCaseContainer = style({
  display: 'flex',
  gap: theme.spacing[2],

  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)  `]: {
      flexDirection: 'column-reverse',
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
