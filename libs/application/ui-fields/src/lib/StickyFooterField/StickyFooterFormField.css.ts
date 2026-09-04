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
  alignItems: 'flex-start',
})
