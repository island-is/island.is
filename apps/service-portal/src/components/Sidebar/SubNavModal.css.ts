import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const active = style({
  display: 'flex',
  position: 'absolute',
  top: 0,
  left: 28,
  width: 220,
  height: 'max-content',
  zIndex: 10,
})

export const inner = style({
  left: 64,
  width: 183,
  borderRadius: theme.border.radius.standard,
  transition: 'all 250ms ease-in-out',
})
