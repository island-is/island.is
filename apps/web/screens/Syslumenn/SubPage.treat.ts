import { globalStyle, style } from 'treat'

export const description = style({})

globalStyle(`${description} p`, {
  fontSize: 24,
  fontWeight: 300,
  lineHeight: '48px',
})

export const smallDescription = style({})

globalStyle(`${smallDescription} p`, {
  fontSize: 18,
  fontWeight: 300,
  lineHeight: '34px',
  marginBottom: 32,
})
