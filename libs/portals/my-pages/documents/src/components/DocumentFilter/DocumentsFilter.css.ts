import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const unreadFilter = style({
  marginBottom: -theme.spacing[4],
})

export const dateFilter = style({
  marginTop: -theme.spacing[4],
  paddingBottom: theme.spacing[2],
})
