import { globalStyle, style } from '@vanilla-extract/css'

export const tableContainer = style({})

globalStyle(`${tableContainer} > div`, {
  overflow: 'visible',
})
