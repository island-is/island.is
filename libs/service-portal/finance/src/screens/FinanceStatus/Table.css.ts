import { style, globalStyle } from '@vanilla-extract/css'

export const printStyle = style({})

globalStyle(
  `${printStyle} td div, ${printStyle} td div p, ${printStyle} p, ${printStyle} span`,
  {
    '@media': {
      print: {
        fontSize: 10,
      },
    },
  },
)

globalStyle(`${printStyle} td, ${printStyle} th`, {
  '@media': {
    print: {
      padding: '6px !important',
    },
  },
})

globalStyle(`${printStyle} span[type=button]`, {
  '@media': {
    print: {
      display: 'none',
    },
  },
})
