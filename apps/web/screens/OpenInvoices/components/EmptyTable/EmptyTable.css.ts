import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const emptyTable = style({
  display: 'flex',
  alignItems: 'center',
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
