import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

// Vertical accent line on the expand column, mirroring the my-pages
// ExpandableTable look.
export const line = style({
  borderLeft: `2px solid ${theme.color.blue400}`,
  width: 0,
  height: 'calc(100% + 1px)',
  left: 0,
  top: 0,
  zIndex: 10,
  position: 'absolute',
})
