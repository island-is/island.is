import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const radioButtonContainer = style({
  marginBottom: theme.spacing[3],
  backgroundColor: theme.color.blue100,
})

export const inputContainer = style({
  maxHeight: '0',
  overflow: 'hidden',
  transition: 'max-height 300ms ease',
})

export const inputAppear = style({
  maxHeight: '300px',
})
