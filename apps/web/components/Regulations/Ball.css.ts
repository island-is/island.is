import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

const { color, spacing } = theme

export const ball = style({
  display: 'inline-block',
  marginRight: spacing[2],
  backgroundColor: color.mint600,
  borderRadius: '50%',
  fontSize: 16 / 18 + 'em',
  width: '1em',
  height: '1em',
  textIndent: '150%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
})
export const ballRed = style({
  backgroundColor: color.red600,
})
export const ballYellow = style({
  backgroundColor: color.yellow600,
})
