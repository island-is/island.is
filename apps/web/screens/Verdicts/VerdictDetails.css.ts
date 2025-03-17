import { globalStyle, style } from '@vanilla-extract/css'

export const pdfContainer = style({})

globalStyle(`${pdfContainer} .react-pdf__Page`, {
  marginBottom: '32px',
})

export const hiddenOnScreen = style({
  '@media': {
    screen: {
      display: 'none',
    },
    print: {
      display: 'block',
    },
  },
})

export const textMaxWidth = style({
  maxWidth: '876px',
})

export const richText = style({})

globalStyle(`${richText} h1:first-of-type, ${richText} h2:last-of-type`, {
  textAlign: 'center',
})

export const verdictHtmlTitleContainer = style({
  maxWidth: '774px',
  textAlign: 'center',
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '16px',
})
