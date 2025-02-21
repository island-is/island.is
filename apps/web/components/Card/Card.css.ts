import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const card = style({
  display: 'flex',
  height: '100%',
  width: '100%',
  flexDirection: 'column',
  cursor: 'pointer',
  boxSizing: 'border-box',
  minHeight: 146,
  textDecoration: 'none',
  position: 'relative',
  ':hover': {
    borderColor: theme.color.purple400,
    textDecoration: 'none',
  },
})
