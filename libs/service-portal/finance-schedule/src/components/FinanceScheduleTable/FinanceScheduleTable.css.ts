import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const line = style({
  width: 1,
  height: theme.spacing[3],
  background: theme.color.dark200,
})
