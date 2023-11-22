import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  paddingBottom: '56.25%',
  position: 'relative',
  display: 'block',
  width: '100%',
})

export const content = style({
  height: '100%',
  width: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
})

export const link = style({
  textDecoration: 'underline',
})

export const playIconContainer = style({
  position: 'absolute',
  zIndex: 1,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: theme.color.blue400,
  padding: '14px',
  borderRadius: '50%',
  cursor: 'pointer',
})

export const modal = style({
  background: theme.color.blue100,
  zIndex: 2,
})

export const closeButton = style({
  display: 'flex',
  justifyContent: 'flex-end',
  background: theme.color.blue100,
  cursor: 'pointer',
})
