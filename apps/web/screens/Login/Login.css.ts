import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const btnLink = style({
  color: theme.color.white,
  marginRight: theme.spacing[3],
  marginBottom: theme.spacing[3],
  display: 'inline-block',
  ':hover': {
    textDecoration: 'none',
  },
})

export const link = style({
  display: 'inline-block',
})
