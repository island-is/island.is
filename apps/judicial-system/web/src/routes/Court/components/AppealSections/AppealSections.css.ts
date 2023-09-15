import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const gridRowEqual = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridGap: theme.spacing[1],
  marginBottom: theme.spacing[1],
})

export const gridRow2fr1fr = style({
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gridGap: theme.spacing[1],
  marginBottom: theme.spacing[1],
})
