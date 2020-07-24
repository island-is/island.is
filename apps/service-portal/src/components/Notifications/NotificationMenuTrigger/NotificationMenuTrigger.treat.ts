import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const button = style({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  width: 72,
  padding: `0 ${theme.spacing['3']}px`,
  overflow: 'hidden',
  transition: 'width 400ms',
})

export const buttonExpanded = style({
  width: 336,
})

export const notificationCount = style({
  position: 'absolute',
  top: '-25%',
  left: '-25%',
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
})

export const info = style({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  opacity: 0,
  transition: 'opacity 400ms',
})

export const infoActive = style({
  opacity: 1,
})

export const infoTitle = style({
  fontSize: 14,
  fontWeight: 600,
})
