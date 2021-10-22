import { style } from '@vanilla-extract/css'

export const allCategoriesLink = style({
  position: 'absolute',
  top: 12,
  maxWidth: '80%',
  left: 0,
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
