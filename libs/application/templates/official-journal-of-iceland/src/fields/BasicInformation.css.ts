import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const modalBase = style({
  display: 'flex',
  alignItems: 'center',
  height: '100vh',
  margin: '0 auto',
  width: '100%',
  maxWidth: 888,
})

export const formGroup = style({
  marginBottom: theme.spacing[6],
})
