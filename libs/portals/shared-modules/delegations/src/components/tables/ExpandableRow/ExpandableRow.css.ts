import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const line = style({
  borderLeft: `2px solid ${theme.color.blue400}`,
  width: 0,
  height: 'calc(100% + 1px)',
  left: 0,
  top: 0,
  zIndex: 10,
  position: 'absolute',
})

export const loader = style({
  minHeight: 24,
  minWidth: 24,
})

export const alignRight = style({
  display: 'flex',
  justifyContent: 'flex-end',
})
