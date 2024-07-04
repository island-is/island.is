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
