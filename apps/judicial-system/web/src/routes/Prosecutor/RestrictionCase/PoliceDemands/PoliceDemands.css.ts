import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(200px, .8fr) 1fr;',
  gridGap: `${theme.spacing[2]}px`,
})
