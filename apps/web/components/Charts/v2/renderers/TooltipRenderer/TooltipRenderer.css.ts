import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const tooltip = style({
  backgroundColor: theme.color.white,
  border: `${theme.border.width.standard}px solid ${theme.color.blue100}`,
  padding: theme.spacing[1],
  borderRadius: theme.border.radius.xs,
})

export const tooltipLabel = style({
  paddingBottom: theme.spacing[1],
  fontWeight: 'bold',
})
