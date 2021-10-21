import { style } from 'treat'

export const hiddenOnPrint = style({
  '@media': {
    print: {
      display: 'none !important',
    },
  },
})
