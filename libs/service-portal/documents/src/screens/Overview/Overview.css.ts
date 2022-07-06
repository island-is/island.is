import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const tableHeading = style({
  boxShadow: `inset 0px -1px 0px ${theme.color.blue200}`,
})

export const unreadFilter = style({
  marginBottom: -theme.spacing[4],
})

export const dateFilter = style({
  marginTop: -theme.spacing[4],
  paddingBottom: theme.spacing[2],
})
