import { style } from 'treat'
import { theme } from '../../theme/index'

export const container = style({
  height: 111,
  display: 'flex',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.color.blue200}`,
})
