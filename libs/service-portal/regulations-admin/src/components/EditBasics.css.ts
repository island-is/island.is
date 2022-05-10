import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
const { spacing } = theme

export const shortcuts = style({
  display: 'flex',
  flexFlow: 'row wrap',
  alignItems: 'center',
})

export const shortcutsButton = style({
  marginLeft: spacing[2],
})
