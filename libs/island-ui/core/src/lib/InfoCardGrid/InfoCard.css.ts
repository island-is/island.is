import { globalStyle, style } from '@vanilla-extract/css'

export const infoCardSmall = style({
  maxWidth: 310,
  minHeight: 450,
})

export const infoCard = style({
  maxWidth: 477,
  minHeight: 432,
})

export const infoCardWide = style({
  maxWidth: 978,
  minHeight: 318,
})

export const wideTitleBox = style({
  flexGrow: 2,
})

export const iconBox = style({})

globalStyle(`${iconBox} > svg`, {
  minWidth: 24,
})
