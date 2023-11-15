import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  maxWidth: '546px',
  marginLeft: 0,
})

export const audio = style({
  borderRadius: theme.border.radius.large,
  background: theme.color.blue100,
  paddingTop: theme.spacing[1],
  paddingBottom: theme.spacing[1],
  margin: 0,
})
