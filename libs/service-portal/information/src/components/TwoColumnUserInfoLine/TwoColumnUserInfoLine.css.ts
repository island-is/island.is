import { globalStyle, style } from '@vanilla-extract/css'

export const content = style({
  wordBreak: 'break-word',
})

export const printable = style({})

globalStyle(`${printable} p`, {
  '@media': {
    print: {
      lineHeight: 1,
      fontSize: '12px',
      paddingBottom: '8px',
    },
  },
})

globalStyle(`${printable} span`, {
  '@media': {
    print: {
      fontSize: '12px',
      color: 'black',
    },
  },
})
