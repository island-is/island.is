import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const dialog = style({
  backgroundColor: 'white',
  minHeight: '100vh',
  padding: `${theme.spacing[4]}px 0`,
})
