import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  padding: `0`,
})

export const dropdownItem = style({
  display: 'flex',
  borderTop: `2px solid ${theme.color.blue200}`,
  paddingTop: `${theme.spacing[3]}px`,
})
