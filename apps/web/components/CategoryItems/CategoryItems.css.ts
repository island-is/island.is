import { globalStyle, style } from '@vanilla-extract/css'

export const card = style({
  minHeight: 108,
})

export const cardLink = style({})

globalStyle(`${cardLink} span`, {
  fontSize: 14,
})
