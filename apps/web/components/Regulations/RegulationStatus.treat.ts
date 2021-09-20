import { style, globalStyle } from 'treat'
import { spacing } from '@island.is/island-ui/theme'

export const printText = style({
  '@media': {
    screen: {
      display: 'none !important',
    },
    print: {
      float: 'right',
      fontSize: 14,
      paddingTop: 2,
      marginLeft: spacing[2],
    },
  },
})
globalStyle(`${printText} > p`, {
  fontSize: 'inherit',
})

export const metaDate = style({
  display: 'inline-block',
  fontSize: '.75em',
  marginRight: '.5em',

  '::before': {
    content: '" –  "',
  },
})
export const linkToCurrent = style({
  display: 'inline-block',
  fontSize: '.75em',

  '::before': { content: '"("' },
  '::after': { content: '")"' },
})
