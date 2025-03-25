import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const itemContainer = style({
  borderStyle: 'solid',
  borderWidth: theme.border.width.standard,
  borderColor: theme.color.transparent,
  borderRadius: theme.border.radius.large,
  transition: 'border-color 150ms ease, opacity 150ms ease',
  padding: theme.spacing[2],
  ':hover': {
    borderColor: theme.color.blue400,
  },
})
