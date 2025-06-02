import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const grid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridGap: theme.spacing[1],
})
