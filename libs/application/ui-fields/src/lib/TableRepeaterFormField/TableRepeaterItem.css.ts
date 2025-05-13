import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const removePaddingTop = style({
  marginTop: `-${theme.spacing[2]}px`,
})
