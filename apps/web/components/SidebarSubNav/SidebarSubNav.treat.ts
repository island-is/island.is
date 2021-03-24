import { style } from 'treat'
import { theme } from '@island.is/island-ui/core'

export const container = style({
  borderLeft: `1px solid ${theme.color.purple200}`,
  paddingLeft: theme.spacing[2],
  margin: `${theme.spacing[1]}px 0`,
})
