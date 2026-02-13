import { globalStyle, style } from '@vanilla-extract/css'

export const inputWrapper = style({
  minWidth: 250,
})

globalStyle(`${inputWrapper} > div > div`, {
  height: 48,
})
