import { globalStyle, style } from '@vanilla-extract/css'

export const filesList = style({})

// Avoid double line: last PdfButton border + Accordion Divider between items.
globalStyle(`${filesList} > *:last-child`, {
  boxShadow: 'none',
})

export const metadataRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flex: 1,
  minWidth: 0,
})

export const childContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  textAlign: 'right',
  minWidth: 0,
  maxWidth: '100%',
})
