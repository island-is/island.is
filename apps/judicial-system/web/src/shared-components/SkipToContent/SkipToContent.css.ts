import { style } from '@vanilla-extract/css'

export const skipToContentLink = style({
  position: 'absolute',
  top: '-40px',
  left: 0,
  background: '#000000',
  color: 'white',
  padding: '8px',

  selectors: {
    '&:focus': {
      top: 0,
    },
  },
})
