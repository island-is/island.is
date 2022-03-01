import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const errorMessage = style({
  overflow: 'hidden',
  maxHeight: '0',
  transition: 'max-height 250ms ease',
})
export const showErrorMessage = style({
  maxHeight: theme.spacing[5],
})
