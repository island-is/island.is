import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const footer = style({
  zIndex: 1,
  backgroundColor: theme.color.overlayDefault,
})

export const floatingShadow = style({
  boxShadow: '0px 8px 16px 0px #00003C29',
})

export const row = style({
  display: 'flex',
})

// TODO: Fix this hack - should follow number of columns
export const label = style({
  marginLeft: 56, // 48px checkbox column + 24px cell padding - 16px footer padding
  width: 'calc(25% - 42px)',
  flexShrink: 0,
  whiteSpace: 'nowrap',
})
