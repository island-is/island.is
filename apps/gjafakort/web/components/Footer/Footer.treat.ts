import { style } from 'treat'

import { theme } from '../../styles'

export const root = style({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: theme.spacing20,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderTop: `1px solid ${theme.gray50}`,
})
