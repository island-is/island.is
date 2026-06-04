import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const dropdown = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  maxHeight: 400,
  maxWidth: 629,
  overflowY: 'auto',
  backgroundColor: theme.color.white,
  boxShadow: theme.shadows.strong,
  borderRadius: theme.border.radius.large,
})
