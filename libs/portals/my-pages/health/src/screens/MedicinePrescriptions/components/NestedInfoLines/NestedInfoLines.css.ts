import { globalStyle, style } from '@vanilla-extract/css'

export const title = style({})

globalStyle(`${title} > p`, {
  fontSize: '14px',
})
