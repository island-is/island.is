import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const card = style({
  boxSizing: 'border-box',
  minHeight: 146,
  textDecoration: 'none',
  ':hover': {
    borderColor: theme.color.purple400,
    textDecoration: 'none',
  },
})
