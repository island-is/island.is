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
  paddingBottom: theme.spacing[6],
})

export const emptyStaging = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 120,
  padding: theme.spacing[3],
  border: `1px dashed ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,
  background: theme.color.blue100,
})
