import { globalStyle, style } from '@vanilla-extract/css'

export const fullWidth = style({})

globalStyle(`${fullWidth} > svg`, {
  width: '100%',
  height: 'auto',
})
