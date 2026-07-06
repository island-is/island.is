import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const dropdown = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  maxHeight: 400,
  maxWidth: 629,
  overflowY: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.color.white,
  boxShadow: theme.shadows.strong,
  borderRadius: theme.border.radius.large,
})

export const scrollableContent = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  overscrollBehavior: 'contain',
})

export const option = style({
  paddingTop: '12px',
  paddingBottom: '12px',
})
