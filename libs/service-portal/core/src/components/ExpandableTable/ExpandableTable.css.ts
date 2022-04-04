import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const line = style({
  borderLeft: `2px solid ${theme.color.blue400}`,
  width: 0,
  height: 'calc(100% + 1px)',
  left: 0,
  top: 0,
  position: 'absolute',
})

export const financeTd = style({
  width: 'max-content',
  display: 'block',
  marginLeft: 'auto',
})

export const loader = style({
  minHeight: 24,
  minWidth: 24,
})

export const detailsIcon = style({
  marginLeft: 8,
})
