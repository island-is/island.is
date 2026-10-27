import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const muted = style({})

// keyText/valueText colors come from the global h4/p reset and the Text
// component, so the override targets those elements rather than the column.
globalStyle(`${muted} h4, ${muted} p, ${muted} li`, {
  color: theme.color.dark300,
})
