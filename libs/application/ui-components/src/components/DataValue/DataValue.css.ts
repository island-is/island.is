import { style } from '@vanilla-extract/css'

import { spacing, theme } from '@island.is/island-ui/theme'

export const dataValue = style({
  marginBottom: spacing[2],

  ':last-of-type': {
    marginBottom: 0,
  },
})

export const errorMessage = style({
  color: theme.color.red600,
  fontWeight: theme.typography.medium,
  fontSize: 14,
  marginTop: theme.spacing[1],
})
