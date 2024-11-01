import { style } from '@vanilla-extract/css'

export const loadingContainer = style({
  position: 'absolute',
  top: 0,
  background: 'white',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
