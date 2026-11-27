import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const sectionHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.spacing[2],
})

// Spacing below the staging section sits inside the expanding block, so it
// opens and closes with the section instead of jumping at either end.
export const stagingSection = style({
  paddingBottom: theme.spacing[5],
})

// Stands in for the rows of a list that has none.
export const emptyList = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 54,
  marginTop: theme.spacing.p2,
  padding: `0 ${theme.spacing[3]}px`,
  border: `1px dashed ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,
  background: theme.color.white,
})
