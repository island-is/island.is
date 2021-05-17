import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const line = style({
  borderLeft: `2px solid ${theme.color.blue400}`,
  width: 0,
  height: 'calc(100% + 1px)',
  left: 0,
  top: 0,
  position: 'absolute',
})
