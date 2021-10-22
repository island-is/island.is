import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const inputFieldContainer = style({
  marginTop: theme.spacing[2],
  overflow: 'hidden',
  maxHeight: 0,
  transition: 'max-height 250ms ease',
})
export const showInput = style({
  maxHeight: '250px',
})
