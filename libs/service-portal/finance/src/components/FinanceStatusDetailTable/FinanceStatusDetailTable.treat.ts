import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const wrapper = style({
  display: 'grid',
})

export const td = style({
  width: 'max-content',
})

export const buttonTd = style({
  width: 'max-content',
  display: 'flex',
  alignItems: 'center',
})

export const textWithButton = style({
  marginRight: theme.spacing[3],
})
