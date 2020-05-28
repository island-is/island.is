import { style } from 'treat'
import { theme } from '../../theme'

export const container = style({
  height: 111,
  display: 'flex',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.color.blue200}`,
})

export const pointer = style({
  cursor: 'pointer',
})
