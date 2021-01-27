import { globalStyle, style } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'

export const intro = style({
  fontWeight: 300,
  fontSize: 20,
  lineHeight: 28 / 20,
  ...themeUtils.responsiveStyle({
    sm: {
      fontSize: 24,
      lineHeight: 34 / 24,
    },
  }),
})

export const heading = style({
  fontSize: 42,
  fontWeight: 600,
  marginBottom: 56,
})

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

export const link = style({
  fontWeight: 300,
  textDecoration: 'none',
  fontSize: 18,
  lineHeight: '42px',
  color: '#0061FF',
})

export const newsBg = style({
  background: '#F8F5FA',
})
