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

export const buttonWrap = style({
  minWidth: theme.spacing[9],
  justifyContent: 'space-around',
  display: 'flex',
})

export const btnSpacer = style({
  marginLeft: theme.spacing[2],
  display: 'inline-flex',
})
