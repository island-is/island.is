import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  overflowY: 'auto',
  overflowX: 'hidden',
  width: '80%',
  height: '100%',
  maxWidth: '305px',
  marginLeft: 'auto',
  background: theme.color.white,
})
