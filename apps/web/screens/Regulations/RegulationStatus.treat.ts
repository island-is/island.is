import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
const { color, spacing } = theme

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

export const ball = style({
  display: 'inline-block',
  marginRight: spacing[2],
  backgroundColor: color.mint600,
  borderRadius: '50%',
  fontSize: 16 / 18 + 'em',
  width: '1em',
  height: '1em',
})
export const ballRed = style({
  backgroundColor: color.red600,
})

export const metaDate = style({
  display: 'inline-block',
})
