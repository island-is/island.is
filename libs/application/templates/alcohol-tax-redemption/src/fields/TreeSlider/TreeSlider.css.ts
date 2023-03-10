import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const valueLabel = style({
  color: theme.color.blue400,
})

export const treeWrapper = style({
  display: 'flex',
  alignItems: 'center',
  transformOrigin: 'bottom',
  minWidth: 0,
  flexShrink: 1,
})

globalStyle(`${treeWrapper} svg`, { width: '1em' })
