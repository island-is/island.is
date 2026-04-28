import { globalStyle, style } from '@vanilla-extract/css'

export const tableContainer = style({})

globalStyle(`${tableContainer} thead th, ${tableContainer} tbody td`, {
  paddingInline: 16,
})
