import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const createCourtCaseContainer = style({
  display: 'flex',
  flexDirection: 'column',
})

export const createCourtCaseButton = style({
  display: 'flex',
  maxHeight: theme.spacing[8],
  marginRight: theme.spacing[2],
})

export const createCourtCaseInput = style({
  flex: 1,
})
