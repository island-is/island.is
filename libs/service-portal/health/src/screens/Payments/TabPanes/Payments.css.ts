import { globalStyle, style } from '@vanilla-extract/css'

export const tableRowStyle = style({})

export const tableFootCell = style({
  fontWeight: 'bold',
})

globalStyle(`${tableRowStyle} > th, ${tableRowStyle} > td`, {
  fontSize: '14px',
  whiteSpace: 'nowrap',
})
