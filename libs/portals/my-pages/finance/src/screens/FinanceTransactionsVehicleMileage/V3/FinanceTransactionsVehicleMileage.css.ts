import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const header = style({
  position: 'relative',
  marginTop: `-${theme.spacing[3]}px`,
  zIndex: theme.zIndex.above,
})
