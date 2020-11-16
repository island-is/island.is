import { style } from 'treat'

export const root = style({
  position: 'fixed',
  bottom: 0,
  right: 0,
  width: 100,
  height: 100,
  outline: '1px solid red',
  opacity: 1,
})

export const button = style({
  display: 'flex',
  justifyContent: 'center',
  cursor: 'pointer',
  position: 'fixed',
  height: 80,
  width: 80,
  zIndex: 9999,
  bottom: 15,
  right: 24,
  outline: 0,
  border: 'none',
  borderRadius: '100%',
  color: 'white',
  fontSize: 38,
})

export const hidden = style({
  opacity: 0,
})
