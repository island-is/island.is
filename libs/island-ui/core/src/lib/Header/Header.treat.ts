import { style } from 'treat'
import { theme } from '../../theme'

export const container = style({
  height: 111,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const userNameContainer = style({
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  minWidth: 0,
  marginLeft: theme.spacing[2],
  marginRight: theme.spacing[2],
})

export const actionsContainer = style({
  display: 'flex',
  alignItems: 'center',
})
