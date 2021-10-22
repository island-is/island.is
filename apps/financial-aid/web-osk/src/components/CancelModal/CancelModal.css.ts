import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const modalBase = style({
  height: '100%',
  display: 'block',
})

export const modalContainer = style({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const modal = style({
  maxWidth: '888px',
  width: '100%',
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.16)',
})

export const exitModal = style({
  position: 'absolute',
  top: '0px',
  right: '0px',
  padding: theme.spacing[3],
})

export const buttonContainer = style({
  flexWrap: 'wrap-reverse',
})
