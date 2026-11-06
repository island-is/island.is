import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const link = style({
  color: theme.color.blue400,
  textDecoration: 'underline',
})

export const yearSelect = style({ minWidth: 160 })

export const tooltipButton = style({
  display: 'flex',
  padding: 0,
  border: 0,
  background: 'none',
  cursor: 'pointer',
})
