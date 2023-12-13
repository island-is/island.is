import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const modalBase = style({
  display: 'flex',
  alignItems: 'center',
  position: 'fixed',
  inset: 0,
  margin: 'auto',
  zIndex: 1,
  width: '100%',
  maxWidth: 888,
})

export const modalContent = style({
  display: 'flex',
  minHeight: 888,
})

export const modalContentInner = style({
  paddingInline: theme.spacing[10],
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
})

export const modalButtons = style({
  marginTop: 'auto',
})

export const formGroup = style({
  marginBottom: theme.spacing[6],
})
