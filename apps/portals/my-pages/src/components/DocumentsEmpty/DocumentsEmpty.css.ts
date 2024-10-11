import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const lock = style({
  position: 'absolute',
  zIndex: 1,
  top: theme.spacing[2],
  right: theme.spacing[3],
})

export const img = style({
  height: 180,
})
