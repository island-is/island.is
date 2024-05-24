import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const infoCardContainer = style({
  position: 'relative',
  background: theme.color.blue100,
  borderRadius: theme.border.radius.large,
})

export const infoCardSection = style({
  display: 'grid',
  gap: theme.spacing[2],
})

export const borderedSection = style({
  borderBottom: `2px solid ${theme.color.blue200}`,
  paddingBottom: theme.spacing[2],
  marginBottom: theme.spacing[2],
})
