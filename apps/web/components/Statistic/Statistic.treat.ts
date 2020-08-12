import { style } from 'treat'

export const container = style({
  maxWidth: '204px',
  textAlign: 'center',
})

export const circle = style({
  position: 'relative',
  paddingTop: '100%',
  borderRadius: '50%',
  background: 'white',
})

export const content = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
})

export const value = style({
  fontSize: '64px',
})
