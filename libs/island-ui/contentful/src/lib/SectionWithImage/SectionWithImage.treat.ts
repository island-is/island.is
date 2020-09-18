import { style } from 'treat'

export const imageContainer = style({
  position: 'relative',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  outline: '1px solid red',
  width: '100%',
  height: 'auto',
})

export const image = style({
  width: '100%',
  maxWidth: 400,
})
