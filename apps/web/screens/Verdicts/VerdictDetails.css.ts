import { globalStyle, style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const pdfContainer = style({})

globalStyle(`${pdfContainer} .react-pdf__Page`, {
  marginBottom: '32px',
})

globalStyle(`${pdfContainer} .docx-wrapper`, {
  backgroundColor: theme.color.blue100,
  padding: 0,
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

globalStyle(`${richText} ul, ${richText} ol`, {
  listStyleType: 'decimal',
  ...themeUtils.responsiveStyle({
    xs: {
      paddingLeft: theme.spacing[3],
    },
    sm: {
      paddingLeft: theme.spacing[5],
    },
    md: {
      paddingLeft: theme.spacing[8],
    },
    lg: {
      paddingLeft: theme.spacing[8],
    },
  }),
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
