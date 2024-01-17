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
  height: '90vh',
  overflowY: 'auto',
})

export const modalContent = style({
  display: 'flex',
  backgroundColor: theme.color.white,
  paddingInline: theme.spacing[3],
  paddingBlock: theme.spacing[10],
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

export const inputWrap = style({
  display: 'flex',
  flexFlow: 'row wrap',
  width: '100%',
  gap: theme.spacing[3],
})

export const inputWrapItem = style({
  flex: 1,
  minWidth: 225,
})
