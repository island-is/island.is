import { globalStyle, style } from '@vanilla-extract/css'

export const pdfContainer = style({})

globalStyle(`${pdfContainer} .react-pdf__Page`, {
  marginBottom: '32px',
})
