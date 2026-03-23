import { style } from '@vanilla-extract/css'

export const wrapper = style({
  display: 'flex',
  justifyContent: 'center',
  marginTop: -48,
  paddingBottom: 8,
  position: 'relative',
  zIndex: 1,
  pointerEvents: 'none',
})

export const pill = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  borderRadius: 30,
  height: 40,
  width: 120,
  pointerEvents: 'auto',
})

export const dot = style({
  display: 'inline-block',
  borderRadius: 8,
  width: 8,
  height: 8,
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  outline: 'none',
  transition: 'width 0.3s ease, background-color 0.3s ease',
})

export const dotActive = style({
  width: 32,
  borderRadius: 5,
})
