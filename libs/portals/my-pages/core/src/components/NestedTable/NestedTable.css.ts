import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const grid = style({
  padding: `0 ${theme.spacing[1]}px`,
})

export const innerGrid = style({
  padding: theme.spacing[1] * 1.5,
})

export const white = style({
  background: theme.color.white,
})

export const titleCol = style({
  paddingLeft: theme.spacing[2],
})

export const wrapper = style({
  display: 'grid',
  background: theme.color.blue100,
  padding: `0 ${theme.spacing[3]}px ${theme.spacing[3]}px ${theme.spacing[3]}px`,
})

export const td = style({
  width: 'max-content',
})

export const alignTd = style({
  marginLeft: 'auto',
})

export const noBorder = style({
  border: 'none',
})
