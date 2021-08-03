import { style, styleMap } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const card = style({
  display: 'flex',
  height: '646px',
  width: '100%',
  flexDirection: 'column',
  boxSizing: 'border-box',
  minHeight: 124,
  textDecoration: 'none',
  position: 'relative',
  ':hover': {
    textDecoration: 'none',
  },
})
