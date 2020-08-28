import { style } from 'treat'

export const container = style({
  borderRadius: '5px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: '#CCDFFF',
  overflow: 'hidden',
  '@media': {
    [`screen and (max-width: 991px)`]: {
      borderRadius: 0,
      border: 'none',
    },
  },
})
