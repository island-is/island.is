import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const checkboxLabelLink = style({
  fontSize: theme.typography.baseFontSize,
  fontWeight: theme.typography.light,
  color: theme.color.blue400,
})

export const checkboxLabelLinkChecked = style({
  color: theme.color.blue400,
  fontWeight: theme.typography.medium,
})
