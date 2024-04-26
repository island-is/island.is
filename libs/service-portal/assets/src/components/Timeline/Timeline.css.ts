import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const outer = style({
  height: 12,
})

export const tooltip = style({
  bottom: 0,
  right: 0,
  top: 0,
  width: theme.spacing[2],
  background: theme.color.transparent,
})
