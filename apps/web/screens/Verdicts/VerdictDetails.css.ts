import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

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

globalStyle(`${richText} p`, {
  textAlign: 'justify',
})

globalStyle(`${richText} h2 + h3`, {
  marginTop: '8px',
})

/** Verdict source HTML often uses `ul` for numbered items; `decimal` gives “1. …” markers. */
globalStyle(`${richText} ul, ${richText} ol`, {
  listStyleType: 'decimal',
  paddingLeft: '1.75em',
})

globalStyle(`${richText} ul li, ${richText} ol li`, {
  color: theme.color.dark400,
  fontWeight: theme.typography.regular,
})

globalStyle(`${richText} ol li::before`, {
  content: 'counters(section, ".") ". "',
  color: theme.color.dark400,
  fontWeight: theme.typography.light,
  fontSize: theme.typography.baseFontSize,
})

export const verdictHtmlTitleContainer = style({
  maxWidth: '774px',
  textAlign: 'center',
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '16px',
})
