import { style, globalStyle } from '@vanilla-extract/css'

export const pdfViewer = style({})

globalStyle(`${pdfViewer} canvas`, {
  maxWidth: '100%',
  width: '100% !important',
  height: 'auto !important',
  border: '1px solid #CCDFFF',
})

export const linkWithoutDecorations = style({
  ':hover': {
    textDecoration: 'none',
  },
})
