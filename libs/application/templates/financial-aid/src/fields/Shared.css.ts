import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const inputContainer = style({
  maxHeight: '0',
  overflow: 'hidden',
  transition: 'max-height 300ms ease',
})

export const inputAppear = style({
  maxHeight: '300px',
})
