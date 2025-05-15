import { style, styleVariants } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const base = style({
  height: theme.border.width.standard,
})

export const weight = styleVariants({
  regular: { background: theme.border.color.standard },
  faded: { background: theme.border.color.blue100 },
  strong: { background: theme.border.color.focus },
  alternate: { background: theme.color.purple200 },
  purple400: { background: theme.color.purple400 },
  purple200: { background: theme.color.purple200 },
  blue300: { background: theme.color.blue300 },
  blueberry200: { background: theme.color.blueberry200 },
  red200: { background: theme.color.red200 },
  black: { background: theme.border.color.black },
})

export const thickness = styleVariants({
  standard: { height: '1px' },
  thick: { height: '2px' },
})
