import { style, globalStyle } from 'treat'
import { spacing, theme } from '@island.is/island-ui/theme'

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

export const statusText = style({
  fontWeight: theme.typography.light,
  marginBottom: 0.5 * spacing[1],
})

export const metaDate = style({
  display: 'inline-block',
  fontSize: '.75em',
  marginRight: '.5em',

  '::before': {
    content: '" –  "',
  },
})
export const toCurrent = style({
  display: 'inline-block',
  fontSize: '.75em',

  '::before': { content: '"("' },
  '::after': { content: '")"' },
})

export const linkToCurrent = style({
  color: theme.color.blue600,
  ':hover': {
    color: theme.color.blue400,
    textDecoration: 'underline',
  },
})
