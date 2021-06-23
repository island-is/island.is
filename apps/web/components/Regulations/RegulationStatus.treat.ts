import { style } from 'treat'
import { theme, spacing } from '@island.is/island-ui/theme'

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
