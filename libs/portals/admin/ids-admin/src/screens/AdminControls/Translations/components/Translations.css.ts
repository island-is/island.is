import { globalStyle, style } from '@vanilla-extract/css'

export const classKey = style({
  width: 150,
  wordBreak: 'break-word',
})

export const tableWrapper = style({})

globalStyle(`${tableWrapper} th`, {
  paddingInline: 16,
})

globalStyle(`${tableWrapper} td`, {
  paddingInline: 16,
})
