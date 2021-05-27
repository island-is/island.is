import { style } from 'treat'

export const printText = style({
  '@media': {
    screen: {
      display: 'none !important',
    },
    print: {
      display: 'block !important',
    },
  },
})

export const metaDate = style({
  display: 'inline-block',
})
