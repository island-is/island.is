import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const line = style({
  borderLeft: `2px solid ${theme.color.blue400}`,
  width: 0,
  height: 'calc(100% + 1px)',
  left: 0,
  top: 0,
  zIndex: theme.zIndex.above,
  position: 'absolute',
})

export const loader = style({
  minHeight: 24,
  minWidth: 24,
})
