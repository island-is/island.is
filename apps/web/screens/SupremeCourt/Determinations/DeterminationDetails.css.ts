import { globalStyle, style } from '@vanilla-extract/css'

export const verdictHtmlTitleContainer = style({
  maxWidth: '774px',
  textAlign: 'center',
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '16px',
})

export const textMaxWidth = style({
  maxWidth: '774px',
})

export const richText = style({})

globalStyle(`${richText} h1:first-of-type, ${richText} h2:last-of-type`, {
  textAlign: 'center',
})
