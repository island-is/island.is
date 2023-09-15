import { style } from '@vanilla-extract/css'

export const container = style({
  position: 'relative',
  display: 'block',
  width: '100%',
})

export const responsiveIframe = style({
  height: '100%',
  width: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  border: 'none',
})
