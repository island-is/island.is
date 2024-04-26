import { style } from '@vanilla-extract/css'

export const container = style({
  position: 'relative',
  border: '1px solid #d2d2d2',
  borderRadius: ' 8px',
  overflow: 'hidden',
  transition: 'border .2s',
})

export const image = style({
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  objectFit: 'contain',
})

export const show = style({
  opacity: 1,
})

export const hide = style({
  opacity: 0,
})
