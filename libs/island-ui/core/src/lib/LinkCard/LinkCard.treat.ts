import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'flex',
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: theme.color.blue100,
  borderRadius: theme.border.radius.large,
  color: theme.color.blue400,
  cursor: 'pointer',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.color.blue200,
  outline: 0,
  ':focus': {
    borderColor: theme.color.blue400,
  },
  ':hover': {
    textDecoration: 'none',
    borderColor: theme.color.blue400,
  },
})
