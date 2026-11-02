import { style, globalStyle } from '@vanilla-extract/css'

export const pdfViewer = style({})
export const pdfSvgPage = style({})

globalStyle(`${pdfViewer} svg`, {
  maxWidth: '100%',
  width: '100% !important',
  height: 'auto !important',
  border: '1px solid #CCDFFF',
})

globalStyle(`${pdfSvgPage} .react-pdf__Page__svg`, {
  width: 'auto !important',
})

export const lazyPage = style({})

// Keep each page at its full size while its canvas isn't drawn, so the
// document height doesn't change as pages are drawn and released
globalStyle(`${lazyPage} > .react-pdf__Page`, {
  width: 'var(--pdf-page-width)',
  height: 'var(--pdf-page-height)',
})

export const linkWithoutDecorations = style({
  ':hover': {
    textDecoration: 'none',
  },
})

export const displayNone = style({
  display: 'none',
})
