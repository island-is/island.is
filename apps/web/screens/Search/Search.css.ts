import { style } from '@vanilla-extract/css'

export const allCategoriesLink = style({
  position: 'absolute',
  maxWidth: '80%',
  top: 25,
  left: 0,
  height: 'auto',
  zIndex: 1,
  ':before': {
    cursor: 'pointer',
    position: 'absolute',
    content: '""',
    top: -10,
    left: 0,
    right: 0,
    bottom: -10,
  },
})
