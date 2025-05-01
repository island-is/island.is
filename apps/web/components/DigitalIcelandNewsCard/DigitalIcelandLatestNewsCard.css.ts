import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const itemContainer = style({
  borderStyle: 'solid',
  borderWidth: theme.border.width.standard,
  borderColor: theme.color.blue200,
  borderRadius: theme.border.radius.large,
  transition: 'border-color 150ms ease, opacity 150ms ease',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  overflow: 'hidden',
  paddingBottom: theme.spacing[3],
  ':hover': {
    borderColor: theme.color.blue400,
  },
})
