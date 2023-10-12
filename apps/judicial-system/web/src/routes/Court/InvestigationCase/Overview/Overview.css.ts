import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const infoSection = style({
  padding: `${theme.spacing[5]}px 0`,
  borderTop: `2px solid ${theme.color.purple100}`,
})

export const prosecutorContainer = style({
  paddingBottom: theme.spacing[6],
  marginBottom: theme.spacing[5],
  borderBottom: `2px solid ${theme.color.purple100}`,
})

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
