import { style, styleMap } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const card = style({
  display: 'flex',
  height: '124px',
  width: '100%',
  flexDirection: 'column',
  cursor: 'pointer',
  boxSizing: 'border-box',
  minHeight: 124,
  textDecoration: 'none',
  position: 'relative',
  ':hover': {
    borderColor: theme.color.purple400,
    textDecoration: 'none',
  },
})
