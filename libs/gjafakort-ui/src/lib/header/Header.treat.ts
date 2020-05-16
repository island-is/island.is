import { style } from 'treat'
import { theme } from '../styles'

export const container = style({
  height: theme.headerHeight,
  display: 'flex',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.blue200}`,
})
