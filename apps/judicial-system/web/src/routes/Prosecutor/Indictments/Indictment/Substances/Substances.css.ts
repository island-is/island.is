import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const gridRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gridGap: theme.spacing[1],
  marginBottom: theme.spacing[1],
})
