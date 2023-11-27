import { style } from '@vanilla-extract/css'

export const flexBox = style({
  '@media': {
    '(max-width: 480px)': {
      display: 'block',
    },
  },
})

export const yearBox = style({
  '@media': {
    '(max-width: 480px)': {
      width: '100%',
      marginRight: 0,
    },
  },
})

export const monthBox = style({
  '@media': {
    '(max-width: 480px)': {
      width: '100%',
      marginLeft: 0,
    },
  },
})
