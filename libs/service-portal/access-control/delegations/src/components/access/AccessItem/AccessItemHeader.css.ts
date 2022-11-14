import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const row = style({
  background: theme.color.blue100,
  display: 'flex',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.color.blue200}`,
})

export const column = style({
  paddingLeft: theme.spacing.p2,
})
