import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  transition: 'outline 150ms ease',
  ':hover': {
    outlineWidth: '1px',
    outlineColor: theme.color.blue400,
    outlineStyle: 'solid',
    borderRadius: theme.border.radius.large,
  },
})
