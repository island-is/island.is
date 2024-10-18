import { globalStyle, style } from '@vanilla-extract/css'

export const fullWidth = style({})

globalStyle(`${fullWidth} svg`, {
  width: '100%',
  height: 'auto',
})

export const halfWidth = style({})

globalStyle(`${halfWidth} svg`, {
  width: '50%',
  height: 'auto',
})
