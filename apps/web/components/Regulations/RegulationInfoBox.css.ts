import { style, globalStyle } from 'treat'
import { theme } from '@island.is/island-ui/theme'
const { spacing, color } = theme

export const container = style({
  '@media': {
    print: {
      marginTop: spacing[6],
      pageBreakInside: 'avoid',
      borderTop: '1px solid #ccc',
      paddingTop: spacing[2],
      borderRadius: 0,
    },
  },
})

globalStyle(`${container} p`, {
  '@media': {
    print: {
      marginBottom: spacing[1],
    },
  },
})
globalStyle(`${container} p > strong`, {
  '@media': {
    print: {
      marginRight: spacing[2],
      fontSize: 14,
    },
  },
})
globalStyle(`${container} p > br`, {
  '@media': {
    print: {
      display: 'none',
    },
  },
})
globalStyle(`${container} p > a`, {
  '@media': {
    print: {
      display: 'inline',
    },
  },
})

// ---------------------------------------------------------------------------

export const copiedIndicator = style({
  color: color.mint400,
  fontSize: '1.3em',
  lineHeight: 1,
  display: 'inline-block',
  verticalAlign: 'middle',
  paddingLeft: '.25em',

  '@keyframes': {
    '0%': { opacity: 1 },
    '100%': { opacity: 0 },
  },
  animation: '@keyframes 1000ms 300ms 1 forwards ease-in-out',
})
