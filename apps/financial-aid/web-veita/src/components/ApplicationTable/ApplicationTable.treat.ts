import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const tableContainer = style({
  borderCollapse: 'separate',
  borderSpacing: `0px ${theme.spacing[2]}px`,
  marginBottom: theme.spacing[4],
})

export const tablePadding = style({
  paddingRight: theme.spacing[4],
})
