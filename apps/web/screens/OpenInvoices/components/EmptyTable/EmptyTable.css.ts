import { style } from '@vanilla-extract/css'

import { spacing, theme } from '@island.is/island-ui/theme'

// Matches T.Data's default paddingLeft/paddingRight (spacing token 3),
// bled via a negative margin so the dividers reach the cell's true edges.
const CELL_PADDING = spacing[3]

export const emptyTable = style({
  display: 'flex',
  alignItems: 'center',
  marginInline: -CELL_PADDING,
  paddingBlock: 66,
})

export const divider = style({
  flexGrow: 1,
  height: theme.border.width.standard,
  background: theme.border.color.standard,
})

export const emptyTableText = style({
  flexShrink: 0,
  paddingInline: 40,
  textAlign: 'center',
  fontStyle: 'italic',
  opacity: 0.5,
})
