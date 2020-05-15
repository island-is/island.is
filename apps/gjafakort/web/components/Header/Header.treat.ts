import { style } from 'treat'

import { theme } from '../../styles'

export const root = style({
  height: theme.spacing20,
  borderBottom: `1px solid ${theme.gray50}`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
