import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: theme.color.white,
  borderRadius: theme.border.radius.large,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.color.blue200,
  alignItems: 'flex-start'
})

export const linkContainer = style({
  boxSizing: 'border-box',
  backgroundColor: theme.color.blue100,
  borderRadius: theme.border.radius.large,
})
