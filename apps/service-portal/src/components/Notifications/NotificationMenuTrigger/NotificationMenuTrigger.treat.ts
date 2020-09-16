import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const notificationCount = style({
  position: 'absolute',
  top: theme.spacing['2'],
  left: 4,
  zIndex: 2,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: theme.spacing['2'],
  height: theme.spacing['2'],
  borderRadius: '100%',
  backgroundColor: theme.color.red400,
  color: '#fff',
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1,
  pointerEvents: 'none',
})
