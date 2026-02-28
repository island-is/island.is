import { globalStyle, style } from '@vanilla-extract/css'

export const linkText = style({})

globalStyle(`${linkText} *`, {
  fontWeight: 300,
})
