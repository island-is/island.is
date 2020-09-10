import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const card = style({
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  cursor: 'pointer',
  borderWidth: 1,
  boxSizing: 'border-box',
  borderStyle: 'solid',
  borderColor: theme.color.purple200,
  transition: 'border-color 150ms ease',
  borderRadius: theme.border.radius.large,
  minHeight: 146,
  textDecoration: 'none',
  position: 'relative',
  ':hover': {
    borderColor: theme.color.purple400,
    textDecoration: 'none',
  },
})
