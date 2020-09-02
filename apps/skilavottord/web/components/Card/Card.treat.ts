import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const card = style({
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  borderWidth: 1,
  boxSizing: 'border-box',
  borderStyle: 'solid',
  borderColor: theme.color.blue200,
  transition: 'border-color 150ms ease',
  borderRadius: theme.border.radius.large,
  minHeight: 170,
  position: 'relative'
})
