import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridColumnGap: `${theme.spacing[2]}px`,
})
