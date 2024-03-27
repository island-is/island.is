import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const tab = style({
  padding: '10px',
  width: '100%',
  cursor: 'pointer',
})

export const selected = style({
  color: theme.color.blue400,
  borderBottom: `1px solid ${theme.border.color.blue400}`,
  fontWeight: 'bolder',
})
