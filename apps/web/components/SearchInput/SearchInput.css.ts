import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const menuColumn = style({
  padding: `${theme.spacing[1]}px 0`,
  flexGrow: 0,

  // equal width for all columns
  flexBasis: '100%',

  // prevent element from getting wider even if content requires it
  width: 0,
  overflow: 'hidden',
})

export const menuRow = style({
  padding: `${theme.spacing[1]}px 0`,
  width: '100%',
  overflow: 'hidden',
})

export const separatorVertical = style({
  flexBasis: '1px',
  flexShrink: 0,
  background: theme.color.blue200,
  margin: `0 ${theme.spacing[3]}px`,
})

export const separatorHorizontal = style({
  flexBasis: '1px',
  background: theme.color.blue200,
  margin: `${theme.spacing[2]}px 0`,
})

export const suggestion = style({
  cursor: 'pointer',
})
