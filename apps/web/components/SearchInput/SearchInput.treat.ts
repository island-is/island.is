import { style } from 'treat'
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

export const separator = style({
  flexBasis: '1px',
  flexShrink: 0,
  background: theme.color.blue200,
  margin: `0 ${theme.spacing[3]}px`,
})
