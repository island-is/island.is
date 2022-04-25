import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  userSelect: 'none',
})

export const borderTop = style({
  borderTop: `1px solid ${theme.color.dark100}`,
})
